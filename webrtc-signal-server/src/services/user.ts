import State from "../State"
import Peer from "../Peer"
import { MessageData } from "../interface"
import WebSocket from "ws"

// 注册
export function register({ type, payload }: MessageData, ws: WebSocket) {
  // 用户已存在
  if (Peer.has(payload.sender)) {
    throw State.USER_EXIST
  }
  let peer = new Peer(payload.sender, ws)
  peer.send({
    type: type + "Response",
    payload: State.USER_REGISTER
  });
}

// 注销
export function logout({ payload }: MessageData) {
  let sender = payload.sender
  // 用户不存在
  if (!Peer.has(sender)) {
    throw State.USER_UNEXIST
  }
  Peer.destroy(sender)
}

// 心跳
export function ping(_: MessageData, ws: WebSocket) {
  ws.send(JSON.stringify({ type: "pong" }))
}