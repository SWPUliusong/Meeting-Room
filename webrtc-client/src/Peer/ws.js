import { Peer } from "./Peer"
import { EventEmitter } from "events"

class WS extends EventEmitter {

  socket = null

  user = null

  // pingTime = 10000

  connect() {
    return new Promise((resolve, reject) => {
      const websocket = this.socket = new WebSocket(`wss://${location.host}/peer-to-peer`)

      websocket.onerror = function (error) {
        console.error("连接错误：\n", error)
        reject(error)
      }

      websocket.onclose = () => {
        Peer.clear()
      }

      websocket.onopen = resolve

      websocket.onmessage = messageData => {
        try {
          let { type, payload } = JSON.stringify(messageData)
          this.emit(type, payload)
        } catch (error) {
          console.error("onmessage error: \n", error)
        }
      }

    })
  }

  // 绑定用户
  bind(user) {
    this.user = user
  }

  send(type, payload) {
    let { id } = this.user
    if (!!id) {
      payload = { sender: id, ...payload }
    }

    this.socket.send(JSON.stringify({ type, payload }))
  }

  destroy() {
    try {
      this.socket.close()
      this.socket = null
      this.user = null
    } catch (error) {
      console.error("destroy error: \n", error)
    }
  }
}