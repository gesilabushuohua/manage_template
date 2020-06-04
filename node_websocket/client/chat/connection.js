/*
 * @Description: 建立 websocket 连接
 * @Date: 2020-06-04 11:02:02
 * @Author: LB
 */ 

const Connection = function(url,onMessage) {
  const SYSTEMTEXT = {
    offline: 0,
    online: 1,
    inroom: 2,
    outroom: 3,
    destroyRoom: 4,
    onchat: 5
  };
  
  let  _ws = null;

  function _createConnect(url,onMsgFn){
    if (window.WebSocket && _ws === null) {
      _ws = new WebSocket(url);
  
      _ws.onopen = function (e) {
        console.log('ws open');
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
        if (onMsgFn) {
          onMsgFn(msg);
        }
      };
    }
  }

  function _sendMessage(msgParams){
    if(!_ws){
      console.log('websocket object invalid');
    }
    _ws.send(JSON.stringify(msgParams));
  }

  // 
  function _online(){}

 
}



