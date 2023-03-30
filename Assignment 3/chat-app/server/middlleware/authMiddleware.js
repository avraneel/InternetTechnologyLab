const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // check if jwt exists and is valid
    if(token) {
        jwt.verify(token, 'sample', (err, decodedToken) => { // verify token
            if(err) {
                console.log(err)
                res.redirect('/login');
            }
            else {
                next();
            }
        } )
    }
    else { // Token does not exist
        res.redirect('/login')
    }
}

module.exports = { requireAuth };