import https from "https"
import fs from "fs"
import path from "path"
import os from "os"
import WebSocket from "ws"
import * as services from "./services"
import { MessageData, Services } from "./interface"

const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    try {
      // 解析消息
      let messageData = JSON.parse(data.toString()) as MessageData
      let type = messageData.type
      try {
        // 调用对应的处理函数
        (services as Services)[type](messageData, ws);
      } catch (error) {
        // 发送处理异常
        ws.send(JSON.stringify({
          type: type + "Response",
          payload: error
        }))
      }
    } catch (error) {
      console.error(error)
    }
  });
});

const options: https.ServerOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const server = https.createServer(options, (req, res) => {
  let url = req.url
  // 将根路径指向index.html
  if (url === "/") {
    url = "/index.html"
  }

  // 处理静态资源
  if (url.includes(".")) {
    let filepath = path.join(__dirname, "../public", url)
    if (fs.existsSync(filepath)) {
      let file = fs.readFileSync(filepath)
      res.writeHead(200);
      return res.end(file);
    }
  }

  // 处理跨域
  if (req.method === "option") {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Request-Method", "*")
    res.writeHead(200);
    return res.end();
  }

  res.writeHead(404);
  return res.end();
})

server.on('upgrade', function upgrade(request, socket, head) {
  if (request.url === '/peer-to-peer') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});


///获取本机ip///
function getIPAdress(): string[] {
  let ips = []
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4') {
        ips.push(alias.address)
      }
    }
  }
  return ips
}

const port = 3000
server.listen(port, () => {
  console.log('listening at: ')
  let ips = getIPAdress()
  for (let ip of ips) {
    console.log(`\thttps://${ip}:${port}`)
  }
})
