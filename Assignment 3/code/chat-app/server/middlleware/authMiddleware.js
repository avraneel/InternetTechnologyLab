const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // check if jwt exists and is valid
    if(token) {
        jwt.verify(token, 'sample', (err, decodedToken) => {
            if(err) {
                res.redirect('/login')
            }
        } )
    }
    else {
        res.redirect('/login')
    }

}