import State from "./State"
import Peer, { SendData } from "./Peer"

/**
 * 房间集合
 */
const Rooms: Map<string, Room> = new Map()

class Room {

  /**
   * 房间id
   */
  id: string = null

  /**
   * 房间最大限制人数
   */
  maxUsersCount: number = 2

  /**
   * 房间内用户
   */
  peers: Set<Peer> = new Set()

  constructor(id: string, maxUsersCount: number) {
    this.id = id
    this.maxUsersCount = maxUsersCount
    Rooms.set(id, this)
  }

  /**
   * 房间现在人数
   */
  get count(): number {
    return this.peers.size
  }

  /**
   * 给房间内所有人发送消息
   * @param data 
   */
  broadcast(data: SendData) {
    this.peers.forEach(peer => {
      peer.send(data)
    })
  }

  /**
   * 向房间内添加人员
   * @param {Peer} peer 
   */
  add(peer: Peer) {
    if (this.count < this.maxUsersCount) {
      this.peers.add(peer)
    } else {
      throw State.ROOM_FULL
    }
  }

  /**
   * 从房间内移除人员
   * @param peer 
   */
  delete(peer: Peer) {
    this.peers.delete(peer)
    // 房间内没有用户时,删除房间
    if (this.count === 0) {
      Rooms.delete(this.id)
    }
  }

  /**
   * 是否存在房间
   * @param roomId 
   */
  static has(roomId: string): boolean {
    return Rooms.has(roomId)
  }

  /**
   * 根据id获取房间
   * @param roomId 
   */
  static get(roomId: string): Room {
    let room = Rooms.get(roomId)
    if (!!room) return room
    throw State.ROOM_UNEXIST
  }
}

module.exports = Room