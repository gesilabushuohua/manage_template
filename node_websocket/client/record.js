/* 
    流程：
    1、HTML5 Recorder 浏览器采集原始音频数据
    2、实时转码为 mp3 文件，websocket 实时上传至服务器
    3、服务器分发其他客户端
    4、客户端接收服务端数据，合并多个 mp3 文件，播放

    Recorder API：
   
    TODO 
    client1 发起通话
    client2 接受通话
    统一后，进行语音通信
    */

// 开始执行
/* window.onload = function init() {
  console.log('onload');
  const url = 'ws://192.168.205.104:8001';
  // 创建连接，监听相关事件，处理 onmessage 接收信息
  _createWSconnection(url);
  // 创建录音实例
  _createRecorderEntity();
  // 添加 录音授权/开始/结束/结束/播放 监听
  _addEvent();
}; */


// 全局变量

// 录音实例
let _recorder = null;

// Webscoket 实例
let _ws = null;

// 接收数据流
let _fileQueue = [];

// 播放标签
let _audio = null;

// 播放列表
let _playFiles = [];

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

/**
 * @description: 创建 websocket 连接，监听相关事件
 * @param {Function}  处理 onmessage j接收数据
 * @return: void
 * @author: LB
 */
function _createWSconnection(url, onMsg) {
  if (window.WebSocket && _ws === null) {
    _ws = new WebSocket(url);

    // 传输方式改为arraybuffer
    /*  _ws.binaryType = 'arraybuffer'; */

    _ws.onopen = function (e) {
      console.log('连接服务器成功');
      const params = { use: curUse };
      _ws.send(JSON.stringify(params));
    };

    _ws.onclose = function (e) {
      console.log('ws close');
      // 关闭录音
      if (_recorder) {
        _recorder.stop();
      }
    };
    _ws.onerror = function () {
      console.log('ws error');
      // 关闭录音
      if (_recorder) {
        _recorder.stop();
      }
    };
    _ws.onmessage = function (e) {
      const msg = e.data;
      console.log('onmessage_______');
      if (onMsg) {
        onMsg(msg);
      }
    };
  }
}





// 文件片段间隔
const space = 20;
/**
 * @description: 接受 websocket msg，实时通话
 * @param {ArrayBuffer} 
 * @return: void
 * @author: LB
 */
function _onWSRealMessage(msg) {
  console.log('receive');
  // 存储接收文件
  _fileQueue.push(msg);
  if (_fileQueue.length > space) {
    _realTimePlayMp3();
  }
}

// 数据加载进行立刻播放
// 文件片越大，片段交接越顺畅
// 把文件合成，与播放区分开

function _openRecorder() {
  _recorder.open(
    function success() {
      console.log('open success');
    },
    function fail() {
      console.log('open fail');
    }
  );
}


// 监听操作
function _addEvent() {
  const tool = document.getElementById('tool');
  tool.onclick = function (e) {
    const opt = e.target.dataset.opt;
    if (!opt) { return; }
    switch (opt) {
      case 'open':
        _recorder.open(
          function success() {
            console.log('open success');
          },
          function fail() {
            console.log('open fail');
          }
        );
        break;
      case 'start':
        console.log('start start');
        _recorder.start();
        break;
      case 'stop':
        console.log('stop');
        // 获取到录音数据 blob
        _recorder.stop(
          function success(blob, duration) {
            console.log('recorder ' + duration);
            _realTimeSendTry(null, true);
          },
          function fail(msg) {
            console.log('录音失败:' + msg);
          }
        );
        break;
      case 'close':
        console.log('close');
        _recorder.close();
        break;
      case 'play':
        console.log('play');
        const fileBytesList = _fileQueue.map(file => {
          let array = new Uint8Array(file);
          return array;
        });
        // 合并成功
        const successFn = function (fileBytes, duration, info) {
          console.log('Mp3Merge successFn');
          /*   const audio = document.createElement('audio');
            audio.controls = true;
            document.body.appendChild(audio);
            const blob = new Blob([fileBytes]);
            // 简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
            audio.src = (window.URL || webkitURL).createObjectURL(blob);
            audio.play(); */
        };
        console.log('Mp3Merge');

        _mp3Merge(fileBytesList, successFn);
        break;
      default:
        break;
    }
  };
}


// 发送数据
function _wsSend(params) {
  _ws.send(params);
}


//重置环境
function _realTimeSendTryReset() {
  _realTimeSendTryTime = 0;
};



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
    meta =
      Recorder.mp3ReadMeta([chunkData.buffer], chunkData.length) || {}; //读取出这个mp3片段信息
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
        bitRate: meta.bitRate
      }
    },
    isClose
  );


  _realTimeSendTryWavTestBuffers = [];
};

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
};

//=====数据传输函数==========
function _transferUpload(
  number,
  blob,
  duration,
  blobRec,
  isClose
) {
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
      _wsSend(msg);
    };
    reader.readAsDataURL(blob);

  
  }

  if (isClose) {
    console.log('No.' + (number < 100 ? ('000' + number).substr(-3) : number) + ':已停止传输');
  }
};

// 实时合并播放音频
function _realTimePlayMp3() {
  const tempQueue = _fileQueue;
  _fileQueue = [];
  const fileBytesList = tempQueue.map(file => {
    let array = new Uint8Array(file);
    return array;
  });
  // 合并成功
  const successFn = function (fileBytes, duration, info) {
    const blob = new Blob([fileBytes]);
    _playFiles.push(blob);
    if (!_audio) {
      _createAudio();
      _playAudio();
    }
  };

  _mp3Merge(fileBytesList, successFn);
}

function _createAudio() {
  _audio = document.createElement('audio');
  document.body.appendChild(_audio);
  _audio.controls = true;
  _audio.loop = false;
  _audio.onended = function () {
    if (_playFiles.length > 0) {
      // 连续播放时间片
      _playAudio();
    }
  };
}

function _playAudio() {
  const blob = _playFiles.shift();
  if (!blob) {
    return;
  }
  // 简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
  _audio.src = (window.URL || webkitURL).createObjectURL(blob);
  _audio.play();
  setTimeout(() => {
    (window.URL || webkitURL).revokeObjectURL(_audio.src);
  }, 5 * 1000);
}


// 创建 recorder 实体
function _createRecorderEntity(isReal) {
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
      }
    });
  }


  _recorder = Recorder(setting);
}

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
  _realTimeOnProcessClear(
    buffers,
    powerLevel,
    bufferDuration,
    bufferSampleRate,
    newBufferIdx,
    asyncEnd
  );
}

// 打开麦克风，获取权限
function _openRecorder() {
  _recorder.open(
    function sucess() {
      console.log('open sucess');
    },
    function fail() {
      console.log('open fail');
    }
  );
}

// mp3 多个片段文件合并
function _mp3Merge(fileBytesList, successFn) {
  // 合并失败
  const failFn = function (errMsg) {
    console.log(errMsg);
  };

  //计算所有文件的长度、校验mp3信息
  let size = 0,
    baseInfo = null;
  for (let i = 0; i < fileBytesList.length; i++) {
    let file = fileBytesList[i];
    let info = _readMp3Info(file);


    if (!info) {
      failFn &&
        failFn('第' + (i + 1) + '个文件不是lamejs mp3格式音频，无法合并');
      return;
    }
    baseInfo || (baseInfo = info);
    if (
      baseInfo.sampleRate != info.sampleRate ||
      baseInfo.bitRate != info.bitRate
    ) {
      failFn && failFn('第' + (i + 1) + '个文件比特率或采样率不一致');
      return;
    }

    size += file.byteLength;
  }
  if (size > 50 * 1024 * 1024) {
    failFn && failFn('文件大小超过限制');
    return;
  }

  //全部直接拼接到一起
  const fileBytes = new Uint8Array(size);
  let pos = 0;
  for (let i = 0; i < fileBytesList.length; i++) {
    const bytes = fileBytesList[i];
    fileBytes.set(bytes, pos);
    pos += bytes.byteLength;
  }

  //计算合并后的总时长
  const duration = Math.round((size * 8) / baseInfo.bitRate);

  successFn(fileBytes, duration, baseInfo);
}

// 读取文件信息
function _readMp3Info(bytes) {
  if (bytes.byteLength < 4) {
    return null;
  }
  let byteAt = function (idx, u8) {
    return ('0000000' + ((u8 || bytes)[idx] || 0).toString(2)).substr(-8);
  };
  let b2 = byteAt(0) + byteAt(1);
  let b4 = byteAt(2) + byteAt(3);

  if (!/^1{11}/.test(b2)) {
    //未发现帧同步
    return null;
  }
  let version = { '00': 2.5, '10': 2, '11': 1 }[b2.substr(11, 2)];
  let layer = { '01': 3 }[b2.substr(13, 2)]; //仅支持Layer3
  let sampleRate = {
    //lamejs -> Tables.samplerate_table
    '1': [44100, 48000, 32000],
    '2': [22050, 24000, 16000],
    '2.5': [11025, 12000, 8000]
  }[version];
  sampleRate && (sampleRate = sampleRate[parseInt(b4.substr(4, 2), 2)]);
  let bitRate = [
    //lamejs -> Tables.bitrate_table
    [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], //MPEG 2 2.5
    [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320] //MPEG 1
  ][version == 1 ? 1 : 0][parseInt(b4.substr(0, 4), 2)];

  if (!version || !layer || !bitRate || !sampleRate) {
    return null;
  }

  return {
    version: version, //1 2 2.5 -> MPEG1 MPEG2 MPEG2.5
    layer: layer, //3 -> Layer3
    sampleRate: sampleRate, //采样率 hz
    bitRate: bitRate //比特率 kbps
  };
}



