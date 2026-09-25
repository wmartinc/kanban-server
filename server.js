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
const { userRoute } = require('./routes/user')
const { changeColumnName, deleteColumn } = require('./databaseActions/columnsDB')

const PORT = process.env.PORT || 3000

const app = express()
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({ origin: ["https://kanbannotes.netlify.app"], allowedHeaders: ["Content-Type", "Authorization"], credentials: true }))
app.use(express.json());

app.use('/api/boards', boardRoute)
app.use('/api/tasks', tasksRoute)
app.use('/api/auth', loginRoute)
app.use('/api/user', userRoute)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ["https://kanbannotes.netlify.app"],
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
      await conexion.from('user').update({ "main_board": dataUser }).eq("id", socket?.user?.id).select("*")
    } catch {
      console.log("Error changing board")
    }
  });

  socket.on("addFavorite", async (boardId) => {
    try {
      await conexion.from('boards').update({ "is_favorite": true }).eq("id", boardId).select("*")
    } catch (error) {
      console.log('Ocurrio un error en agregar el favorito', error.message)
    }
  })

  socket.on("removeFavorite", async (boardId) => {
    try {
      await conexion.from('boards').update({ "is_favorite": false }).eq("id", boardId).select("*")
    } catch (error) {
      console.log('Ocurrio un error en eliminar el favorito', error.message)
    }
  })

  socket.on("checkFavorite", async (info) => {
    try {
      const { data } = await conexion.from('boards').select("is_favorite").eq("id", info.board_id).eq("user_id", info.user_id)
      if(data[0].is_favorite) {
        socket.emit("checkFavoriteResponse", true)
      }
    } catch (error) {
      console.log('Ocurrio un error en verificar el favorito.', error.messsage)
      socket.emit("checkFavoriteResponse", false)
    }

  })

  socket.on('changeColumnName', async (columnInformation) => {
    await changeColumnName(columnInformation)
  })

  socket.on('deleteColumn', async (columnId) => {
    await deleteColumn(columnId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
}

io.on('connection', onConnection)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})