/*
 * @Description: websocket 实时通信
 * @Date: 2020-05-26 16:23:30
 * @Author: LB
 */

const ws = require('nodejs-websocket');

console.log('start open websocket');

// 链接集，用于 一对一，一对多聊天
const connectionMap = {};

// TODO　未发送消息集，监听到上线，发送消息

// 创建连接
const server = ws.createServer(function (connection) {

  connection.on('connect', function (code) {
    console.log('开启连接', code);
  })

  // 接收信息,类型 string
  connection.on('text', function (res) {
    const resObj = JSON.parse(res);
    const { use, from, to } = resObj;
    
    if (use) {
      console.log('recevie text', use);
      connectionMap[use] = connection;
    } else {
      console.log('recevie text', from, to);
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
    removeConnection(connection);
  });

  // 异常
  connection.on('error', function (code, reason) {
    console.log('ws throw error');
    removeConnection(connection);
  });

});


/* 
  移除无效连接
*/
function removeConnection(connection) {
  for (const key in connectionMap) {
    if (connection === connectionMap[key]) {
      delete connectionMap[key];
      return;
    }
  }
}

// 广播消息, text
function broadcastText(senders, text) {
  senders.forEach(function (sender) {
    const connection = connectionMap[sender];
    if (connection) {
      console.log('broadcast');
      connection.sendText(text);
    } else {
      console.log('no connection');
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