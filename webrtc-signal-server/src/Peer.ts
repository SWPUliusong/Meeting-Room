import Room from "./Room"
import State from "./State"
import WebSocket from "ws"

export type SendData = string | Buffer | Object

export interface PeerInstance {
  id: string
  roomId: string
  ws: WebSocket
  join(roomId: string | Room): this
  leave(): this
  send(data: SendData): void
  broadcast(data: SendData): void
}

const Peers: Map<string, Peer> = new Map()

class Peer {

  // 端的id
  id: string = null

  // 端所在的房间id
  roomId: string = null

  // 端对应连接
  ws: WebSocket = null

  /**
   * 初始化端
   * @param id 端的id
   * @param ws 端对应连接
   */
  constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
    Peers.set(id, this)
    // websocket关闭时,回收资源
    ws.onclose = () => {
      Peer.destroy(id)
    }
  }

  /**
   * 加入房间
   * @param roomId 房间id
   */
  join(roomId: string | Room) {
    let room: Room
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
   * @param data 
   */
  send(data: SendData) {
    let type = Object.prototype.toString.call(data).slice(8, -1)
    // JSON化普通对象
    if (type === "Object") {
      data = JSON.stringify(data)
    }
    this.ws.send(data)
  }

  /**
   * 给房间内其他人发送消息
   * @param data 
   */
  broadcast(data: SendData) {
    let room = Room.get(this.roomId)
    if (!!room) {
      room.peers.forEach(peer => {
        if (peer !== this) {
          peer.send(data)
        }
      })
    }
  }

  /**
   * 获取用户
   * @param userId 
   */
  static get(userId: string) {
    let peer = Peers.get(userId)
    if (!!peer) return peer
    throw State.USER_UNEXIST
  }

  /**
   * 判断用户是否已存在
   * @param userId 
   */
  static has(userId: string) {
    return Peers.has(userId)
  }

  /**
   * 销毁用户连接
   * @param userId 
   */
  static destroy(userId: string) {
    if (!Peers.has(userId)) return
    try {
      let peer = Peers.get(userId)
      Peers.delete(userId)
      peer.leave()
    } catch (error) { }
  }

  /**
   * 给所有用户广播消息
   * @param data 
   */
  static broadcast(data: SendData) {
    Peers.forEach(socket => {
      socket.send(data)
    })
  }

  /**
   * 获取房间内所有用户
   * @param roomId 
   */
  static getRoomUsers(room: string | Room) {
    if (typeof room === "string") {
      roomId = roomId.id Room.get()
    }
    let userIds = []
    Peers.forEach((socket, id) => {
      if (socket.roomId === roomId) {
        userIds.push(id)
      }
    })
    return userIds
  }
}

export default Peer