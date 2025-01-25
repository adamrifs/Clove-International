const generateToken = require('../Config/utils')
const admins = require('../Models/adminSchema')
const bcrypt = require('bcryptjs')

const adminSignup = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: 'all fields required' })
        }

        const existingAdmin = await admins.findOne({ email })
        if (existingAdmin) {
            return res.status(500).json({ message: 'Admin already exist with this email' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new admins({ email, password: hashedPassword })
        if (newAdmin) {
            generateToken(newAdmin._id, res)
            await newAdmin.save()
            res.status(200).json({ message: newAdmin })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: 'all fields required' })
        }
        const admin = await admins.findOne({ email })
        if (!admin) {
            return res.status(500).json({ message: 'no account found' })
        }
        const ispassword = await bcrypt.compare(password, admin.password)
        if (!ispassword) {
            return res.status(500).json({ message: 'password not match' })
        }
        generateToken(admin._id, res)
        res.status(200).json({ message: 'login succesfull', email: admin.email, password: admin.password })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
const adminChangePassword = async (req, res) => {
    try {
        const { newpassword } = req.body
        const id = req.user._id
        console.log(newpassword)
        const admin = await admins.findById(id)
        if (!admin) {
            return res.status(400).json({ message: 'no user found' })
        }
        const hashPassword = await bcrypt.hash(newpassword, 10)
        admin.password = hashPassword
        await admin.save()
        res.status(200).json({ message: 'password changed' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
const getAdmin = async (req, res) => {
    try {
        const allAdmin = await admins.find()
        res.status(200).send(allAdmin)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
const checkAdmin = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({ message: 'logout succesfull' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
module.exports = { adminSignup, adminLogin, adminChangePassword, checkAdmin, logout }