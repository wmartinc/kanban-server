const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const { boardRoute } = require('./routes/boards')
const { tasksRoute } = require('./routes/tasks')
const cors = require('cors')
const morgan = require('morgan')
const loginRoute = require('./routes/login')
const cookieParser = require('cookie-parser')

const PORT = 3000 || process.env.PORT

const app = express()
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json());

app.use('/api/boards', boardRoute)
app.use('/api/tasks', tasksRoute)
app.use('/api/auth', loginRoute)

const server = http.createServer(app)

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