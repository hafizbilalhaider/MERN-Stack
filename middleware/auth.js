const jwt = require('jsonwebtoken');

const config = require('config');

const isAuth = (req, res, next) => {
    // GET token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if(!token) {
        return res.status(401).json({msg: 'No token, authorization failed'});
    };

    //verify token
    try{
        const decode = jwt.verify(token, config.get('jwtSecret'));

        req.user = decode.user;
        next();
    }
    catch (err) {
        res.status(401).json({msg: 'token is not valid!'});
    }
} 

module.exports = isAuth;