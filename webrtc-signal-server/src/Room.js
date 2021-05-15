const Status = require("./Status")
const Socket = require("./Socket")

/**
 * @type {Map<string, Room>}
 */
const Rooms = new Map()

class Room {

  /**
   * @type {string}
   * 房间id
   */
  id = null

  /**
   * @type {number}
   * 房间最大限制人数
   */
  maxUsersCount = 2

  /**
   * 房间内用户
   */
  peers = new Set()

  constructor(id, maxUsersCount) {
    this.id = id
    this.maxUsersCount = maxUsersCount
    Rooms.set(id, this)
  }

  /**
   * 房间现在人数
   */
  get count() {
    return this.peers.size
  }

  /**
   * 给房间内所有人发送消息
   * @param {string|Blob|ArrayBufferLike|ArrayBufferView} data 
   */
  broadcast(data) {
    this.peers.forEach(socket => {
      socket.send(data)
    })
  }

  /**
   * 向房间内添加人员
   * @param {Socket} socket 
   */
  add(socket) {
    if (this.count < this.maxUsersCount) {
      this.peers.add(socket)
    } else {
      throw Status.ROOM_FULL
    }
  }

  /**
   * 从房间内移除人员
   * @param {Socket} socket 
   */
  delete(socket) {
    this.peers.delete(socket)
    // 房间内没有用户时,删除房间
    if (this.count === 0) {
      Rooms.delete(this.id)
    }
  }

  static has(roomId) {
    return Rooms.has(roomId)
  }

  static get(roomId) {
    let room = Rooms.get(roomId)
    if (!!room) return room
    throw Status.ROOM_UNEXIST
  }
}

module.exports = Room