const https = require("https")
const fs = require('fs');
const path = require("path")
const WebSocket = require("ws")
const services = require("./services")

const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(messageData) {
    try {
      // 解析消息
      messageData = JSON.parse(messageData.toString())
      try {
        let type = messageData.type
        // 调用对应的处理函数
        services[type](messageData, ws)
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

const options = {
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

server.listen(3000, () => {
  console.log('listening at 3000')
})
