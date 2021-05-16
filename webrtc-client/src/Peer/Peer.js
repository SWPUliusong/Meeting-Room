const noop = () => { }

/**
 * @type {Map<string, Peer>}
 */
const Peers = new Map()

export class Peer extends RTCPeerConnection {

  /**
   * @type {MediaStream}
   */
  localStream = new MediaStream()

  /**
   * @type {MediaStream}
   */
  remoteStream = new MediaStream()

  /**
   * @typedef Options
   * @prop {string} remoteId 远端用户id
   * @prop {MediaStreamConstraints} constraints 本地媒体限制
   * @prop {(ev: RTCPeerConnectionIceEvent) => any} onicecandidate 本地媒体限制
   * @param {Options} options 
   * @param {(pc: Peer) => void} callback 
   */
  constructor(options, callback) {

    if (Peer.has(options.remoteId)) {
      return Peer.get(options.remoteId)
    }

    super()

    navigator
      .mediaDevices
      .getUserMedia(options.constraints)
      .then(stream => {

        this.onicecandidate = event => {
          let cb = options.onicecandidate || noop
          cb(event)
        }

        this.ontrack = event => {
          this.remoteStream.addTrack(event.track)
        }

        let localStream = this.localStream
        stream.getTracks().forEach(track => {
          this.addTrack(track)
          localStream.addTrack(track)
        })

        Peer.save(options.remoteId, this)

        // 当链接关闭时,清空资源
        this.onsignalingstatechange = () => {
          if (this.signalingState === "closed") {
            Peer.remove(options.remoteId)
            this.dispatchEvent(new Event("close", {
              bubbles: false
            }))
          }
        }

        callback(this)
      })

  }

  static has(key) {
    return Peers.has(key)
  }

  static save(key, peer) {
    Peers.set(key, peer)
  }

  static get(key) {
    return Peers.get(key)
  }

  static remove(key) {
    Peers.delete(key)
  }

  static clear() {
    Peers.forEach(peer => {
      peer.close()
    })
    Peers.clear()
  }
}