const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');
// handle errors

const maxAge = 24*60*60;

const createToken = (id) => {
    return jwt.sign({ id }, 'sample', {
        expiresIn: maxAge 
    })
}

module.exports.public_get = (req, res) => {
    res.render('public');
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
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge*1000
        });
        res.status(201).json({ user: user._id });
    } 
    catch(err) {
        //console.log("Error is: " + err);
        const errors = { password: 'Min password length is 6'};
        res.status(400).send(errors);
    }
    console.log(username);
    console.log(password);
    // res.send('new signup');
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge*1000
        });
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ msg: 'Incorrect username or password '});
    }
    // res.send('new login');
}