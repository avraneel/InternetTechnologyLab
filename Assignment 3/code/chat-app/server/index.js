const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const bcrpyt = require('bcrypt');
const User = require('./models/User');
const session = require('express-session');

const app = express();

const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

mongoose.set('strictQuery', false);
const authRoutes = require('./routes/auth');
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) {
    return res.status(401).send('Invalid email or password');
  }
  //const validPassword = await bcrypt
})


io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('connect message');

  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });

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