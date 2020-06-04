/*
 * @Description: websocket 实时通信，接受、转发客户端信息
 * @Date: 2020-05-26 16:23:30
 * @Author: LB
 */


/* 
function

TODO
1、用户上线，建立连接，标记链接 online，存入 connectionMap
2、用户发起对讲，在线空闲，建立房间，下发房间号，不在线返回 offline，据接 refuse
3、用户对讲中，房间号下发信息
4、对话中，两人以上，退出房间，两人退出，销毁房间
5、对讲结束，销毁房间
6、下线，移除链接


NOT TODO
1、用户发送通话，在线空闲，建立房间，下发房间号，不在线返回 offline，据接 refuse
2、用户通话中，
*/

const ws = require('nodejs-websocket');

console.log('start open websocket');

// 链接集
const connectionMap = {};

// 在房间内用户
const onRoomUser = [];

// 房间集
const roomMap = {};




// 创建连接
const server = ws.createServer(function (connection) {

  connection.on('connect', function (code) {
    console.log('开启连接', code);
  })

  // 接收信息,类型 string
  connection.on('text', function (res) {
    onMessageText(res);
  });

  // 接受到二进制内容
  connection.on('binary', function (inStream) {
    console.log('on binary');
    /*   
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
      */

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



const SYSTEMTEXT = {
  offline: 0,
  online: 1,
  inroom: 2,
  outroom: 3,
  destroyRoom: 4,
  onchat: 5
};

// 接受客户端信息/文本
function onMessageText(res) {
  const resObj = JSON.parse(res);
  const { command, from, tos } = resObj;

  switch (command) {
    case SYSTEMTEXT.offline:
      const connection = connectionMap[from];
      connection.close();
      break;
    case SYSTEMTEXT.online:
      addConnection(from, connection);
      break;
    case SYSTEMTEXT.inroom:
      createRoom(from, tos);
      break;
    case SYSTEMTEXT.outroom:
      exitRoom(from, tos);
      break;
    case SYSTEMTEXT.destroyRoom:
      destroyRoom(from, tos)
      break;
    case SYSTEMTEXT.onchat:
      onChat(from, tos, res);
      break;
    default:
      break;
  }

}


// 上线，添加链接
function addConnection(use, connection) {
  if (use && connection) {
    connectionMap[use] = connection;
    sendTextToFrom(use, SYSTEMTEXT.online);
  } else {
    console.log('use no exist');
  }
}

// 用户指定接受方，创建聊天室
function createRoom(from, tos) {

  const validTos = [];
  const invalidTos = [];

  tos.forEach(to => {
    const toInCalling = onRoomUser.includes(to);
    const connection = connectionMap[to];
    // 非占用，可联系
    if (!toInCalling && connection) {
      validTos.push(to);
    } else {
      invalidTos.push(to);
    }
  });

  // 发起方不被占用，有效接受方>1 创建房间
  if (validTos.length > 1) {
    const roomId = Date.now();
    const room = [from, ...validTos];
    onRoomUser.push(...room);
    roomMap[roomId] = room;
    sendRoomIDToUse(from, tos, roomId);
  }

  console.log(`${from} connection, validTo ${validTos}, invalid ${invalidTos}`);

}

// 用户退出房间
function exitRoom(roomId, from) {
  if (!roomMap[roomId]) {
    console.log(`${roomId} room is no exist`);
  }
  const roomPersonNum = roomMap[roomId].length;
  if (roomPersonNum > 2) {
    sendTextToFrom(from, SYSTEMTEXT.outroom);
  } else {
    destroyRoom()
  }
}

// 用户销毁房间
function destroyRoom(roomId, from) {
  if (roomMap[roomId]) {
    delete roomMap[roomId];
    console.log(`${from} delete ${roomId}`);
    sendTextToFrom(from, SYSTEMTEXT.destroyRoom);
  }
}

// 下线，移除链接
function removeConnection(connection) {
  for (const key in connectionMap) {
    if (connection) {
      sendTextToFrom(from, SYSTEMTEXT.offline);
    }

    if (connection === connectionMap[key]) {
      delete connectionMap[key];
      return;
    }
  }
}

// 下发消息
function onChat(from, tos, content) {
  tos.forEach(to => {
    const connection = connectionMap[to];
    if (connection) {
      connection.sendText(content);
    } else {
      console.log('sendTextToTarget no connection');
    }
  });
}


function sendRoomIDToUse(from, to, roomId) {
  const uses = [from, ...to];
  uses.forEach(use => {
    const connection = connectionMap[use];
    const res = { command: SYSTEMTEXT.inroom, roomId };
    connection.sendText(JSON.stringify(res));
  });
}




server.listen(8001);

console.log('ws create finish');