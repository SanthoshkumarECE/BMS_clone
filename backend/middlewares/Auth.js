const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const secretkey = process.env.JWT_SECRET_KEY
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided.' });
    }
    try {
        console.log("in the middle ware")
        const decoded = jwt.verify(token, secretkey);

        req.user = decoded;
        console.log(req.user)
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = verifyJWT