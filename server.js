const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const http = require('http');
let server = http.createServer(app)
const socketIO = require('socket.io');
const io = socketIO(server);
let rooms = {};

const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 3003;
console.log(publicPath)


// middlewires
app.use(express.static(publicPath));
app.use(cors({ origin: true, credentials: true }));

// socket handling
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  // for room creation
  socket.on('createRoom', (data) => {
    console.log('data create');
    console.log(data);
    const { roomName, roomData } = data;
    const room = rooms[roomName];
    if(!room){
      rooms[roomName] = roomData;
      socket.emit('newRoom', { roomName, roomData });
      socket.join(roomName);
      console.log(rooms);
      io.in(roomName).emit('roomCreated', { message: `Room ${roomName} has been created!` });
    }    
  });
  // for join room
  socket.on('joinRoom', (data) => {
    console.log('data join');
    console.log(data);
    const { roomName, roomData = {} } = data;
    const {roomPassword = '', userName = ''} = roomData;

    console.log(rooms);
    let room = rooms[roomName];
    if (!room) {
      socket.emit('joinError', 'Room does not exist');
      return;
    }
    if (room.roomPassword !== roomPassword) {
      console.log('rooms');
      console.log(rooms);
      socket.emit('joinError', 'Incorrect password');
      return;
    }
    if(rooms[roomName]){
      socket.join(roomName);
      // const test = io.sockets.adapter.rooms[roomName];
      
      if(rooms[roomName].members){
        if(rooms[roomName].userName !== userName){
          rooms[roomName].members += 1;
        }
      }else{
        rooms[roomName].members = 1;
      }
      console.log(rooms[roomName].members)
      room = rooms[roomName];
    }
    
    
  });
  // for chat msg
  socket.on('chat-message', (msg, roomConfig) => {
    const {roomName = '', roomData = {}} = roomConfig;
    console.log('hbgjgughbghuglgui');
    console.log(roomName);
    console.log(rooms);
    io.in(roomName).emit('get-chat-message', msg, roomData);
  });
});

// server start
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});