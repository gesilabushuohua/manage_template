/*
 * @Description: 实时语音模块，依赖 Recorder API
 * @Date: 2020-06-05 16:43:51
 * @Author: LB
 */ 


var RealRecord = (function () {
  const real = {};

  // 录音实例
  _recorder = null;



  // TODO
  // 创建 recorder 实体
  real._createRecorderEntity = function (isReal) {
    if (_recorder !== null) {
      return;
    }

    //  注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
    const setting = {
      // mp3格式
      type: 'mp3',
      // 指定采样率hz
      sampleRate: 16000,
      // 比特率kbps，其他参数使用默认配置
      bitRate: 16,
    };

    if (isReal) {
      Object.assign(setting, {
        // 录音实时回调，大约1秒调用12次本回调
        onProcess: _onRecorderProcess,

        // 将直接得到的 PCM 片段编码生成 mp3 数据
        takeoffEncodeChunk: function (chunkBytes) {
          //接管实时转码，推入实时处理
          _realTimeSendTry(chunkBytes, false);
        },
      });
    }

    _recorder = Recorder(setting);
  };

  real._openRecorder = function () {
    _recorder.open(
      function success() {
        console.log('open success');
      },
      function fail() {
        console.log('open fail');
      }
    );
  };

  real._startRecorder = function () {
    _recorder.start();
  };

  real._stopRecoder = function (fn) {
    _recorder.stop(
      function success(blob, duration) {
        fn(blob, duration);
      },
      function fail(msg) {
        console.log('recorder fail', msg);
      }
    );
  };

  real._closeRecorder = function () {
    _recorder.close();
  };

  //重置环境
  _realTimeSendTryReset = function () {
    _realTimeSendTryTime = 0;
  };



  // 监听录音实时回调
  function _onRecorderProcess(
    // buffer 中 PCM 数据，为浏览器采集的原始音频数据
    buffers,
    powerLevel,
    bufferDuration,
    bufferSampleRate,
    newBufferIdx,
    asyncEnd
  ) {
  /*   _realTimeOnProcessClear(
      buffers,
      powerLevel,
      bufferDuration,
      bufferSampleRate,
      newBufferIdx,
      asyncEnd
    ); */
  }

  // 打开麦克风，获取权限
  real._openRecorder = function () {
    _recorder.open(
      function sucess() {
        console.log('open sucess');
      },
      function fail() {
        console.log('open fail');
      }
    );
  };

  // 开始实时通话
  real._startRecorder = function () {
    _recorder.start();
  };

  // 关闭实时通话
  real._stopRecorder = function () {
    _recorder.stop();
  };

  // 关闭麦克风权限
  real._closeRecorder = function () {
    _recorder.close();
  };

  // mp3 chunk数据会缓冲，当pcm的累积时长达到这个时长，就会传输发送。这个值在takeoffEncodeChunk实现下，使用0也不会有性能上的影响。
  let _sendInterval = 1000;

  // 缓冲变量
  let _realTimeSendTryTime = 0;
  let _realTimeSendTryNumber;
  let _transferUploadNumberMax;
  let _realTimeSendTryBytesChunks;
  let _realTimeSendTryClearPrevBufferIdx;
  let _realTimeSendTryWavTestBuffers;
  let _realTimeSendTryWavTestSampleRate;

  // 文件片段间隔
  const space = 20;
  
  //=====实时处理核心函数==========
  function _realTimeSendTry(chunkBytes, isClose) {
    if (chunkBytes) {
      //推入缓冲再说
      _realTimeSendTryBytesChunks.push(chunkBytes);
    }

    let t1 = Date.now();
    if (!isClose && t1 - _realTimeSendTryTime < _sendInterval) {
      return; //控制缓冲达到指定间隔才进行传输
    }
    _realTimeSendTryTime = t1;
    let number = ++_realTimeSendTryNumber;

    // mp3缓冲的chunk拼接成一个更长点的mp3
    let len = 0;
    for (let i = 0; i < _realTimeSendTryBytesChunks.length; i++) {
      len += _realTimeSendTryBytesChunks[i].length;
    }
    let chunkData = new Uint8Array(len);
    for (let i = 0, idx = 0; i < _realTimeSendTryBytesChunks.length; i++) {
      let chunk = _realTimeSendTryBytesChunks[i];
      chunkData.set(chunk, idx);
      idx += chunk.length;
    }
    _realTimeSendTryBytesChunks = [];
    //推入传输
    let blob = null,
      meta = {};
    if (chunkData.length > 0) {
      //mp3不是空的
      blob = new Blob([chunkData], { type: 'audio/mp3' });
      meta = Recorder.mp3ReadMeta([chunkData.buffer], chunkData.length) || {}; //读取出这个mp3片段信息
    }

    // 上传数据
    _transferUpload(
      number,
      blob,
      meta.duration || 0,
      {
        set: {
          type: 'mp3',
          sampleRate: meta.sampleRate,
          bitRate: meta.bitRate,
        },
      },
      isClose
    );

    _realTimeSendTryWavTestBuffers = [];
  }

  //=====实时处理时清理一下内存（延迟清理），本方法先于RealTimeSendTry执行======
  function _realTimeOnProcessClear(
    buffers,
    powerLevel,
    bufferDuration,
    bufferSampleRate,
    newBufferIdx,
    asyncEnd
  ) {
    if (_realTimeSendTryTime == 0) {
      _realTimeSendTryTime = Date.now();
      _realTimeSendTryNumber = 0;
      _transferUploadNumberMax = 0;
      _realTimeSendTryBytesChunks = [];
      _realTimeSendTryClearPrevBufferIdx = 0;
      _realTimeSendTryWavTestBuffers = [];
      _realTimeSendTryWavTestSampleRate = 0;
    }

    //清理PCM缓冲数据，最后完成录音时不能调用stop，因为数据已经被清掉了
    //这里进行了延迟操作（必须要的操作），只清理上次到现在的buffer
    for (let i = _realTimeSendTryClearPrevBufferIdx; i < newBufferIdx; i++) {
      buffers[i] = null;
    }
    _realTimeSendTryClearPrevBufferIdx = newBufferIdx;

    //备份一下方便后面生成测试wav
    for (let i = newBufferIdx; i < buffers.length; i++) {
      _realTimeSendTryWavTestBuffers.push(buffers[i]);
    }
    _realTimeSendTryWavTestSampleRate = bufferSampleRate;
  }

  //=====数据传输函数==========
  function _transferUpload(number, blob, duration, blobRec, isClose) {
    _transferUploadNumberMax = Math.max(_transferUploadNumberMax, number);
    if (blob) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = reader.result;
        const params = {
          from: curUse,
          to: curSends,
          file: base64,
        };
        const msg = JSON.stringify(params);
        if(){

        }
      };
      reader.readAsDataURL(blob);
    }

    if (isClose) {
      console.log(
        'No.' +
          (number < 100 ? ('000' + number).substr(-3) : number) +
          ':已停止传输'
      );
    }
  }

  return real;
})();
