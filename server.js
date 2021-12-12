const socketio = require('socket.io')
const express =require("express")
const http = require("http")

const port = 8090

const app = express()

app.use(express.static('public'))


const Server = http.createServer(app)
const io = socketio(Server)

Server.listen(port, function() {
  console.log('Server is listeng on port: ' + port)
})
const usersList = {}

io.on('connection', socket => {
  socket.on('new-user', userName => {
    usersList[socket.id] = userName
    socket.broadcast.emit('user-connected', userName)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, 
        userName: usersList[socket.id]} )
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', usersList[socket.id])
    delete usersList[socket.id]
  })
})