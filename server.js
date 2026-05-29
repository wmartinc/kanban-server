const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const PORT = 3000 || process.env.PORT

const app = express()
const server = http.createServer(app)

// Sirve para poder vincular sockets con el servidor http.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

io.on('connection', (socket) => {
  socket.on('mensaje', (obj) => {
    console.log(obj)
  })
  })

io.on('mensaje', (obj) => {
  console.log(obj)
})

app.get('/', (req, res) => {
  res.send('Hello World!');
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})