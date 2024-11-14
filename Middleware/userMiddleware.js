const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        res.status(403).json({ message: "token required" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: "invalid token" })
        }
        req.user = user
        next()
    })
}

module.exports = authenticateToken