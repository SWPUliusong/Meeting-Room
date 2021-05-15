const userServices = require("./user")
const rtcServices = require("./rtc")
const meetingServices = require("./meeting")


module.exports = {
  ...userServices,
  ...rtcServices,
  ...meetingServices,
}