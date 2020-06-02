/*
 * @Description: websocket 实时通信
 * @Date: 2020-05-26 16:23:30
 * @Author: LB
 */

const ws = require('nodejs-websocket');

console.log('start open websocket');


const connectionMap = {};

// 创建连接
const server = ws.createServer(function (connection) {

  connection.on('connect', function (code) {
    console.log('开启连接', code);
  })

  // 接收信息,类型 string
  connection.on('text', function (res) {
    console.log('recevie text', res);
    const resObj = JSON.parse(res);
    const { use, to } = resObj;
    if (use){
      connectionMap[use] = connection;
    }else{
      broadcastText(to, res);
    }
      
  });

  // 接受到二进制内容
  connection.on('binary', function (inStream) {

    // Empty buffer for collecting binary data
    var data = Buffer.alloc(0)
    // Read chunks of binary data and add to the buffer
    inStream.on("readable", function () {
      var newData = inStream.read()
      if (newData)
        data = Buffer.concat([data, newData], data.length + newData.length)
    });

    inStream.on("end", function () {
      console.log("Received " + data.length + " bytes of binary data")
      broadcastBinary(connection, data);
    });

  });

  // 关闭
  connection.on('close', function (code, reason) {
    console.log('close ws connection');

  });

  // 异常
  connection.on('error', function (code, reason) {
    console.log('ws throw error');
    
  });

});


/* 
  移除无效连接
*/
function removeConnection(connection) {
  
}

// 广播消息, text
function broadcastText(sender, text) {
  server.connections.forEach(function (connection) {
    if (sender !== connection) {
      console.log('broadcast');
      connection.sendText(text);
    }
  })
};

// 广播消息,二进制
function broadcastBinary(sender, stream) {
  server.connections.forEach(function (connection) {
    if (sender !== connection) {
      console.log('broadcast');
      connection.sendBinary(stream);
    }
  })
};


server.listen(8001);

console.log('ws create finish');