const Status = require("../Status")
const Socket = require("../Socket")

function rtcSignalHandler({ type, payload }) {
  let { receiver } = payload
  // 用户不存在
  if (!Socket.has(receiver)) {
    throw Status.USER_UNEXIST
  }
  Socket.get(receiver).send({ type, payload });
}

// 发送offer
exports.offer = rtcSignalHandler

// 发送answer
exports.answer = rtcSignalHandler

// 发送candidate
exports.candidate = rtcSignalHandler