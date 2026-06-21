const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const { boardRoute } = require('./routes/boards')
const { tasksRoute } = require('./routes/tasks')
const cors = require('cors')
const morgan = require('morgan')
const loginRoute = require('./routes/login')
const cookieParser = require('cookie-parser')
const { conexion } = require('./controllers/connection')

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

const onConnection = (socket) => {
  console.log('A user connected');

  socket.on('selectBoard', async (dataUser) => {
    const { data } = await conexion.from('user').update({"main_board": dataUser}).eq("id", 1).select("*")
    if(data.length >  0) {
      socket.emit('selectBoardResponse', data)
    } 
    
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
}

io.on('connection', onConnection)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})