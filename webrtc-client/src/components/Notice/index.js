import Vue from "vue"
import NoticeOptions from "./index.vue"

const NoticeConstructor = Vue.extend(NoticeOptions)

let instance = new NoticeConstructor({
  el: document.createElement("div")
})

document.body.appendChild(instance.$el)

let noticeTimer = null
export default function Notice(msg, timeout = 2000) {
  clearTimeout(noticeTimer)
  instance.show = true
  instance.msg = msg
  noticeTimer = setTimeout(() => {
    instance.show = false
    instance.msg = ""
  }, timeout)
}
