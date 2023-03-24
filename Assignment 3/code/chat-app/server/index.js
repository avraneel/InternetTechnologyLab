const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const bcrpyt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

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

const maxAge = 24*60*60;

let un = ""

const online=[];

const createToken = (id) => {
    return jwt.sign({ id }, 'sample', {
        expiresIn: maxAge 
    })
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/signup', (req, res) => {
  res.render('signup');
})

app.get('/public', (req, res) => {
  const token = req.cookies.jwt;
    jwt.verify(token, 'sample', (err, decodedToken) => { // verify token
        if(err) {
            console.log(err)
            res.redirect('/login');
        }
        else {
            id = decodedToken.id;
            User.findById(id, (err, user) => {
                if(err) return;
                un = user.username;
                res.render('public',{ username: user.username });               
            });
        }
    } );
})

app.get('/home', (req, res) => {
  const token = req.cookies.jwt;
    
    jwt.verify(token, 'sample', (err, decodedToken) => { // verify token
        if(err) {
            console.log(err)
            res.redirect('/login');
        }
        else {
            id = decodedToken.id;
            User.findById(id, (err, user) => {
                if(err) return;
                res.render('home',{ username: user.username });               
            });
        }
    } );
})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.create({ username, password, sid: "" });
      const token = createToken(user._id);
      res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge*1000
      });
      un = username;
      res.status(201).json({ user: user._id, username: username });
  } 
  catch(err) {
      console.log(err);
      const errors = { password: 'Min password length is 6'};
      res.status(400).send(errors);
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge*1000
        });
        un = username
        res.json({ user: user._id, username: username });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ msg: 'Incorrect username or password '});
    }
})

app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
})

const users = []

io.on('connection', (socket) => {
  
  console.log('user ' + socket.id + un + ' connected');
  users[socket.id] = un;
  console.log(users)
  io.emit('connect message', users[socket.id]); // Want to pass username here

  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', { msg: msg, username: users[socket.id] + " sent a message" });
  });

  socket.on('chat img message', (msg) => {
    console.log(msg);
    io.emit('chat img message', {url: msg, username: users[socket.id] + " sent an image"});
  })
  uname = users[socket.id]
  socket.on('disconnect', () => {
    console.log(users)
    console.log('user disconnected');
    io.emit('disconnect message', users[socket.id]);
  });
});

// Listening
server.listen(3000, () => {
  console.log('Listening on *:3000');
});

//app.use(authRoutes);