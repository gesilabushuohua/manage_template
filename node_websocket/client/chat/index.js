/*
 * @Description: 录音，上传、接受服务端语音数据，依赖 Recorder.js，websocket 服务
 * @Date: 2020-06-04 11:04:35
 * @Author: LB
 */

/* 
1、HTML5 采集音频;
2、音频处理;
3、用户上线
4、用户呼叫
5、用户
*/

// TODO 主持人模式

const Chat = (function(){
  const chat = {};

  // 引入 sound
  const _sound = SoundRecord;

  

  // 信息机制
  let _isOnline = false;
  let _isOnRoom = false;
  let _roomId = null;
  let _use = null;
  let _onHandleVideoFn = null;
  let _url = null;
  let _onVideoFn = null;


  const SYSTEMTEXT = {
    offline: 0,
    online: 1,
    createRoom: 2,
    inroom: 3,
    outroom: 4,
    destroyRoom: 5,
    onchat: 6

  };


  // websocket 实例
  let _ws = null;

  // 初始化录音对话
  chat._initRecordChat = function(url, onVideoFn) {
    _url = url;
    _onVideoFn = onVideoFn;
  }


  // TODO 实时对话


  //===================发送、接受服务端信息=================
  chat._createWS = function() {
    if (window.WebSocket && _ws === null && _url) {
      _ws = new WebSocket(_url);

      _ws.onopen = function (e) {
        console.log('ws open');
      };

      _ws.onclose = function (e) {
        console.log('ws close');
      };

      _ws.onerror = function () {
        console.log('ws error');
      };

      _ws.onmessage = function (e) {
        const msg = e.data;
        console.log('onmessage_______');
        if (_onMessage) {
          _onMessage(msg);
        }
      };
    }
  }

  _sendMessage = function(msgParams) {
    if (!_ws) {
      console.log('websocket object invalid');
    }
    _ws.send(JSON.stringify(msgParams));
  }


  // 上线
  chat._online = function(use) {
    _use = use;
    const params = {
      command: SYSTEMTEXT.online,
      from: use
    };
    _sendMessage(params);
  }

  // 离线
  chat._offline = function() {
    const params = {
      command: SYSTEMTEXT.offline,
      from: _use
    };
    _sendMessage(params);
  }

  // 创建房间
  chat._createRoom = function(tos) {
    const params = {
      command: SYSTEMTEXT.createRoom,
      from: _use,
      tos
    };
    _sendMessage(params);
  }

  // 退出房间
  chat._exitRoom = function() {
    const params = {
      command: SYSTEMTEXT.outroom,
      from: _use,
      roomId: _roomId
    }
    _sendMessage(params);
  }

  // 销毁房间
  chat._destroyRoom = function() {
    const params = {
      command: SYSTEMTEXT.destroyRoom,
      from: _use,
      roomId: _roomId
    };
    _sendMessage(params);
  }

  chat._getRoomStatus = function () {
    return _isOnRoom;
  }

  // 聊天
  function  _sendVideo(file) {
    const params = {
      command: SYSTEMTEXT.onchat,
      from: _use,
      roomId: _roomId,
      file
    };
    _sendMessage(params);
  }



  // 接收信息
  function _onMessage(msg) {
    const res = JSON.parse(msg);
    const { command, from } = res;
    switch (command) {
      case SYSTEMTEXT.online:
        _online = true;
        _use = from;
        break;
      case SYSTEMTEXT.offline:
        _online = false;
        _use = null;
        break;
      case SYSTEMTEXT.createRoom:
        _isOnRoom = true;
        const { roomId } = res;
        _roomId = roomId;
        break;
      case SYSTEMTEXT.inroom:
        console.log('connection use already in other room');
        break;
      case SYSTEMTEXT.outroom:
        _isOnRoom = false;
        _roomId = null;
        break;
      case SYSTEMTEXT.destroyRoom:
        _roomId = null;
        break;
      case SYSTEMTEXT.onchat:
        const { file } = res;
        if (file && _onVideoFn) {
          _onVideoFn(from, file);
        }
        break;
      default:
        break;
    }
  };


  //===============录音、实时语音、语音文件字节流处理，录音、实时语音不可共用同一实例====================

  // 创建录音实体
  chat._createRecorder = function() {
    _sound._createRecorderEntity();
  }

  //TODO 创建实时语音实体


  // 开启录音权限
  chat._openRecorder = _sound._openRecorder;


  // 开始录音/实时通话
  chat._startRecorder = _sound._startRecorder;


  // 结束录音
  chat._stopRecoder = function(getRecorderFileFn) {
    _sound._stopRecoder(function getRecorder(blob, duration) {
      console.log(`recorder ${duration}`);
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log('recorder video');
        const base64 = reader.result;
        
        // 发送语音
        _sendVideo(base64);
        if(getRecorderFileFn){
          getRecorderFileFn(base64);
        }
      };
      reader.readAsDataURL(blob);
    });
  }


  // 结束实时通话
  chat._stopReal = function() {
    _sound._stopRecoder();
  }

  // 关闭录音权限
  chat._closeRecorder = _sound._closeRecorder;


  return chat;
})();


