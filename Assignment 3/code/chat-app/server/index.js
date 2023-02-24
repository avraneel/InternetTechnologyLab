const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const authRoutes = require('./routes/authRoutes');
app.set('view engine', 'ejs');


app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(authRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



/*
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});*/

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('connect message');

  socket.on('chat message', (msg) => {
    //console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('disconnect message');
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});

