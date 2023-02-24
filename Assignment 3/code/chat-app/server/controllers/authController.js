const User = require('../models/User');

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({username, password});
    }
    catch(err) {
        console.log(err);
        res.status(400).send('error user not created');
    }

    res.send('new signup');
}

module.exports.login_post = (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    res.send('new login');
}