const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const admins = require('../Models/adminSchema')
dotenv.config()

const protectRoute = async (req, res, next) => {
    try {
        console.log('req.headers:', req.headers);
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        // const token = req.cookies.jwt
        // if (!token) {
        //     res.status(500).json({ message: 'token required' })
        // }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.status(500).json({ message: 'unauthorized login' })
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