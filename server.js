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
const { verifyAccessToken, verifyRefreshToken } = require('./utils/jwtVerifications')

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
    credentials: true
  }
});

const parseCookies = (header) => {
  const cookies = {};
  if (!header) return cookies;
  header.split(';').forEach(pair => {
    const [name, ...rest] = pair.split('=');
    cookies[name.trim()] = rest.join('=').trim();
  });
  return cookies;
};

io.use((socket, next) => {
  const cookies = parseCookies(socket.handshake.headers.cookie || socket.request.headers.cookie);
  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return next(new Error('Authentication required'));
  }

  const user = accessToken
    ? verifyAccessToken(accessToken)
    : verifyRefreshToken(refreshToken);

  if (!user) {
    return next(new Error('Authentication required'));
  }

  socket.user = user;
  next();
});

const onConnection = (socket) => {

  socket.on('changeBoard', async (dataUser) => {
    try {
      const { data } = await conexion.from('user').update({ "main_board": dataUser }).eq("id", socket?.user?.id).select("*")
      if (data.length > 0) {
        console.log("Board changed successfully")
      }
    } catch {
      console.log("Error changing board")
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
}

io.on('connection', onConnection)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})