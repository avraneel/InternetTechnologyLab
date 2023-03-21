const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const bcrpyt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User')
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');

const app = express();

const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

mongoose.set('strictQuery', false);
app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(cookieparser());

mongoose.connect("mongodb://127.0.0.1:27017/ChatApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const onlineUsers = [];

var token = ""

io.on('connection', (socket) => {
  
  console.log('a user connected');
  nam = ""
  console.log("soc " + socket.id)
  io.emit('connect message', { sid: socket.id, uid: nam });
  // Connection me
  

  //console.log(socket.handshake.query.onlineUsers);

  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('chat img message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('disconnect message');
  });
});

// Listening
server.listen(3000, () => {
  console.log('Listening on *:3000');
});

app.use(authRoutes);