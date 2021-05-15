const Status = require("../Status")
const Socket = require("../Socket")

// 注册
exports.register = ({ type, payload }, ws) => {
  // 用户已存在
  if (Socket.has(payload.sender)) {
    throw Status.USER_EXIST
  }
  let socket = new Socket(payload.sender, ws)
  socket.send({
    type: type + "Response",
    payload: Status.USER_REGISTER
  });
}

// 注销
exports.logout = ({ payload }) => {
  let sender = payload.sender
  // 用户不存在
  if (!Socket.has(sender)) {
    throw Status.USER_UNEXIST
  }
  Socket.destroy(sender)
}