const dotenv = require('dotenv')
const jwt =require('jsonwebtoken')
const admins = require('../Models/adminSchema')
dotenv.config()

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(500).json({ message: 'token required' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(500).json({ message: 'unauthorized token' })
        }
        const user = await admins.findById(decoded.userId).select('-password')
        if (!user) {
            res.status(400).json({ message: 'user not found' })
        }
        req.user = user
        next()

    } catch (error) {
        console.log(error, 'error occured')
    }
}
module.exports = protectRoute