function Message(code, message) {
  return { code, message }
}

export default {
  /**
   * 用户
   */
  USER_OFFLINE: Message(10000, "用户不在线"),
  USER_EXIST: Message(10001, "用户已存在"),
  USER_UNEXIST: Message(10002, "用户不存在"),
  USER_REGISTER: Message(10003, "用户注册成功"),
  USER_LEAVE_MEETING: Message(10004, "用户已离开会议"),

  /**
   * 房间
   */
  ROOM_EXIST: Message(20000, "房间已存在"),
  ROOM_UNEXIST: Message(20001, "房间不存在"),
  ROOM_FULL: Message(20002, "房间人数已达上限"),
  ROOM_CREATED: Message(20003, "房间创建成功"),
  ROOM_JOIN: Message(20004, "加入房间成功"),
}