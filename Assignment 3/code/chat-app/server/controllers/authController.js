const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');
const UserSocket = require('../models/UserSocket');

const maxAge = 24*60*60;

const online=[];

const createToken = (id) => {
    return jwt.sign({ id }, 'sample', {
        expiresIn: maxAge 
    })
}

let un = ""

function getToken() {
    
}

module.exports.public_get = function render_public(req, res, next) {
    const token = req.cookies.jwt;
    un = "lol"
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
                const filter = { username: un};
                const update = { sid: socket.id};
                res.render('public',{ username: user.username });               
            });
        }
    } );
    return un;
   
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({ username, password, sid: "" });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge*1000
        });
        var onl = {username: username, status: "online"};
        online.push(onl);
        var json = JSON.stringify(online);
        console.log(json);
        const fs = require('fs');
        fs.writeFile('./on.json', json, (err)=>{

        });
        res.status(201).json({ user: user._id, username: username });
        online.push(username);
    } 
    catch(err) {
        console.log(err);
        const errors = { password: 'Min password length is 6'};
        res.status(400).send(errors);
    }
}

module.exports.login_post = async function loginpost(req, res) {
    const { username, password } = req.body;
    try {
        const us = await UserSocket.create({socketId: "", userId: username});
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
    //return username;
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}

module.exports.home_get = (req, res) => {
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
    //return username;
}
