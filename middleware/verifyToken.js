const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === undefined) return res.status(401).json({ status: false, message: 'Unauthorization' });
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
        if (err) return res.status(403).json({ status: false, message: 'Invalid token' });
        req.email = decode.email;
        next();
    });
};

module.exports = {
    verifyToken,
};
