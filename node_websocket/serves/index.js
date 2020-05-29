/*
 * @Description: websocket 实时通信
 * @Date: 2020-05-26 16:23:30
 * @Author: LB
 */

const ws = require('nodejs-websocket');

console.log('start open websocket');


// 创建连接
const server = ws.createServer(function (connection) {

  connection.on('connect', function (code) {
    console.log('开启连接', code);
  })

  // 接收信息,类型 string
  connection.on('text', function (res) {
    console.log('recevie text');
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
    })
    inStream.on("end", function () {
      console.log("Received " + data.length + " bytes of binary data")
      broadcast(connection, data);
    })




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

// 广播消息,二进制
function broadcast(sender, stream) {
  server.connections.forEach(function (connection) {
    if (sender !== connection) {
      console.log('broadcast');
      connection.sendBinary(stream);
    }
  })
};


server.listen(8001);

console.log('ws create finish');