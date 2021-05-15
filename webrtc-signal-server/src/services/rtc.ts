import State from "../State"
import Peer from "../Peer"
import { MessageData } from "../interface"

function rtcSignalHandler({ type, payload }: MessageData) {
  let { receiver } = payload
  // 用户不存在
  if (!Peer.has(receiver)) {
    throw State.USER_UNEXIST
  }
  Peer.get(receiver).send({ type, payload });
}

// 发送offer
export const offer = rtcSignalHandler

// 发送answer
export const answer = rtcSignalHandler

// 发送candidate
export const candidate = rtcSignalHandler