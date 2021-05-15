const Room = require("./Room")
const Status = require("./Status")

/**
 * @type {Map<string, Socket>}
 */
const Sockets = new Map()

class Socket {

  roomId = null

  /**
   * 
   * @param {string} id 
   * @param {WebSocket} ws 
   */
  constructor(id, ws) {
    this.id = id
    this.ws = ws
    Sockets.set(id, this)
    // websocket关闭时,回收资源
    ws.onclose = () => {
      Socket.destroy(id)
    }
  }

  /**
   * 加入房间
   * @param {string | Room} roomId 
   */
  join(roomId) {
    let room
    if (roomId instanceof Room) {
      room = roomId
    } else {
      room = Room.get(roomId)
    }
    room.add(this)
    this.roomId = room.id
    return this
  }

  /**
   * 离开房间
   */
  leave() {
    if (!this.roomId) return
    Room.get(this.roomId).delete(this)
    return this
  }

  /**
   * 发送数据
   * @param {string|Blob|ArrayBufferLike|ArrayBufferView} data 
   */
  send(data) {
    let type = Object.prototype.toString.call(data).slice(8, -1)
    // JSON化普通对象
    if (type === "Object") {
      data = JSON.stringify(data)
    }
    this.ws.send(data)
  }

  /**
   * 给房间内其他人发送消息
   * @param {string|Blob|ArrayBufferLike|ArrayBufferView} data 
   */
  broadcast(data) {
    let room = Room.get(this.roomId)
    if (!!room) {
      room.peers.forEach(socket => {
        if (socket !== this) {
          socket.send(data)
        }
      })
    }
  }

  /**
   * 获取用户
   * @param {string} userId 
   */
  static get(userId) {
    let socket = Sockets.get(userId)
    if (!!socket) return socket
    throw Status.USER_UNEXIST
  }

  /**
   * 判断用户是否已存在
   * @param {string} userId 
   */
  static has(userId) {
    return Sockets.has(userId)
  }

  /**
   * 销毁用户连接
   * @param {string} userId 
   */
  static destroy(userId) {
    if (!Sockets.has(userId)) return
    try {
      let socket = Sockets.get(userId)
      Sockets.delete(id)
      socket.leave()
    } catch (error) { }
  }

  /**
   * 给所有用户广播消息
   * @param {string|Blob|ArrayBufferLike|ArrayBufferView} data 
   */
  static broadcast(data) {
    Sockets.forEach(socket => {
      socket.send(data)
    })
  }

  /**
   * 获取房间内所有用户
   * @param {string | Room} roomId 
   */
  static getRoomUsers(roomId) {
    if (roomId instanceof Room) {
      roomId = roomId.id
    }
    let userIds = []
    Sockets.forEach((socket, id) => {
      if (socket.roomId === roomId) {
        userIds.push(id)
      }
    })
    return userIds
  }
}

module.exports = Socket