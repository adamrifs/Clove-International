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
        await newAdmin.save()
        res.status(200).json({ message: newAdmin })

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
        const ispassword = await bcrypt.compare(password,admin.password)
        if(!ispassword){
            return res.status(500).json({message:'password not match'})
        }
        res.status(200).json({message:'login succesfull',email:admin.email,password:admin.password})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { adminSignup ,adminLogin}