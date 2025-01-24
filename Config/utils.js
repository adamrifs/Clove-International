const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '5d' })
    res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite:'strict'
    })
    return token
}
module.exports = generateToken