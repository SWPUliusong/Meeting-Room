const Status = require("../Status")
const Socket = require("../Socket")
const Room = require("../Room")

// 创建会议
exports.createMeeting = ({ type, payload }) => {
  let { sender, roomId, maxUsersCount } = payload
  if (!roomId) {
    // 没有自定义会议房间id,则生成一个随机串
    roomId = Date.now() + Math.random().toString(36).slice(2)
  } else if (Room.has(roomId)) {
    // 房间已存在
    throw Status.ROOM_EXIST
  }

  let room = new Room(roomId, maxUsersCount)
  Socket
    .get(sender)
    .join(room)
    .send({
      type: type + "Response",
      payload: {
        roomId,
        ...Status.ROOM_CREATED
      }
    });
}

// 加入会议
exports.joinMeeting = ({ type, payload }) => {
  let { sender, roomId } = payload
  // 房间不存在
  if (!Room.has(roomId)) {
    throw Status.ROOM_UNEXIST
  }

  let room = Room.get(roomId)
  let socket = Socket.get(sender)
  // 加入房间, 并回复房间现有的用户
  socket.join(room).send({
    type: type + "Response",
    payload: {
      ...Status.ROOM_CREATED,
      users: Socket.getRoomUsers(roomId)
    }
  });
  // 通知房间其他人，有人加入
  // socket.broadcast({
  //   type: "otherJoinMeeting",
  //   payload: {
  //     newcomer: sender
  //   }
  // })
  socket.broadcast({
    type: "notice",
    payload: {
      content: `${sender}加入会议`
    }
  })
}

// 离开会议
exports.leaveMeeting = ({ type, payload }) => {
  let { sender } = payload

  let socket = Socket.get(sender)

  // 通知房间其他人，自己已离开
  // socket.broadcast({
  //   type: "otherLeaveMeeting",
  //   payload: {
  //     userId: sender
  //   }
  // })
  socket.broadcast({
    type: "notice",
    payload: {
      content: `${sender}离开会议`
    }
  })

  // 离开房间
  socket.leave().send({
    type: type + "Response",
    payload: Status.USER_LEAVE_MEETING
  });
}