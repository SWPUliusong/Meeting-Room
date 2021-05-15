import WebSocket from "ws";

export type SendData = string | Buffer | Object

export interface MessageDataPayload {
  sender?: string
  receiver?: string
  roomId?: string
  maxUsersCount?: number
  users?: string[]
  content?: string
  offer?: string
  answer?: string
  candidate?: string
}

export interface MessageData {
  type: string
  payload: MessageDataPayload
}

export interface Services {
  [key: string]: (message: MessageData, ws?: WebSocket) => void
}