import State from "../State"
import Peer from "../Peer"
import Room from "../Room"
import { MessageData } from "../interface"

// 创建会议
exports.createMeeting = ({ type, payload }: MessageData) => {
  let { sender, roomId, maxUsersCount } = payload
  if (!roomId) {
    // 没有自定义会议房间id,则生成一个随机串
    roomId = Date.now() + Math.random().toString(36).slice(2)
  } else if (Room.has(roomId)) {
    // 房间已存在
    throw State.ROOM_EXIST
  }

  let room = new Room(roomId, maxUsersCount)
  let peer = Peer.get(sender)

  if (!peer) {
    throw State.USER_UNEXIST
  }

  peer.join(room).send({
    type: type + "Response",
    payload: {
      roomId,
      ...State.ROOM_CREATED
    }
  });
}

// 加入会议
exports.joinMeeting = ({ type, payload }: MessageData) => {
  let { sender, roomId } = payload
  // 房间不存在
  if (!Room.has(roomId)) {
    throw State.ROOM_UNEXIST
  }

  let room = Room.get(roomId)
  let peer = Peer.get(sender)

  // 获取房间内现有的用户id
  let userIds = Room.getUsers(roomId).map(peer => peer.id)
  // 加入房间, 并回复房间现有的用户
  peer.join(room).send({
    type: type + "Response",
    payload: {
      ...State.ROOM_JOIN,
      users: userIds
    }
  });

  peer.broadcast({
    type: "notice",
    payload: {
      content: `${sender}加入会议`
    }
  })
}

// 离开会议
exports.leaveMeeting = ({ type, payload }: MessageData) => {
  let { sender } = payload

  let peer = Peer.get(sender)

  // 通知房间其他人，自己已离开
  peer.broadcast({
    type: "notice",
    payload: {
      content: `${sender}离开会议`
    }
  })

  // 离开房间
  peer.leave().send({
    type: type + "Response",
    payload: State.USER_LEAVE_MEETING
  });
}