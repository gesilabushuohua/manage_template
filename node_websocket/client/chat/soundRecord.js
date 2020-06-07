/*
 * @Description: 录音模块，依赖 Recorder，API 查阅
 * @Date: 2020-06-04 11:02:39
 * @Author: LB
 */

var SoundRecord = (function () {
  const sound = {};

  // 录音实例
  _recorder = null;



  // TODO
  // 创建 recorder 实体
  sound._createRecorderEntity = function (isReal) {
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

  sound._openRecorder = function () {
    _recorder.open(
      function success() {
        console.log('open success');
      },
      function fail() {
        console.log('open fail');
      }
    );
  };

  sound._startRecorder = function () {
    _recorder.start();
  };

  sound._stopRecoder = function (fn) {
    _recorder.stop(
      function success(blob, duration) {
        fn(blob, duration);
      },
      function fail(msg) {
        console.log('recorder fail', msg);
      }
    );
  };

  sound._closeRecorder = function () {
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
  sound._openRecorder = function () {
    _recorder.open(
      function sucess() {
        console.log('open sucess');
      },
      function fail() {
        console.log('open fail');
      }
    );
  };

  // 开始录音/实时通话
  sound._startRecorder = function () {
    _recorder.start();
  };

  // 关闭录音/实时通话
  sound._stopRecorder = function () {
    _recorder.stop(getRecorderFn, function fail(msg) {
      console.log('get recorder fail', msg);
    });
  };

  // 关闭麦克风权限
  sound._closeRecorder = function () {
    _recorder.close();
  };

  return sound;
})();
