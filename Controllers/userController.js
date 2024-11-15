const users = require('../Models/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const register = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, c_password } = req.body
        if (!firstname, !lastname, !email, !phone, !password, !c_password) {
            return res.status(400).send('all fields required')
        }
        if (password != c_password) {
            return res.status(400).send('password not match')
        }
        const userExist = await users.findOne({ email })
        if (userExist) {
            return res.status(400).send('user already exist')
        }
        const phoneExist = await users.findOne({ phone })
        if (phoneExist) {
            return res.status(400).send('phone number already exist')
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = new users({ firstname, lastname, email, phone, password: hashedpassword })
        await user.save()
        res.status(200).json({ message: 'data saved succesfull' })
    }
    catch (error) {
        res.status(500).json({ message: 'internal error occured' })
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body
        const user = await users.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        })
        if (!user) {
            res.status(500).json({ message: 'invalid email or phone number' })

        }
        const ispasswordvalid = await bcrypt.compare(password, user.password)
        if (!ispasswordvalid) {
            res.status(500).json({ message: 'password not match' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.json({ message: 'login succesfull', token })
    }
    catch (error) {
        res.status(500).json({ message: 'error occured' })
        console.log(error)
    }
}

const getUser = async (req, res) => {
    try {
        const user = await users.find()
        res.status(200).send(user)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

const edituser = async (req, res) => {
    try {
        const { id } = req.params
        const { investments } = req.body
        const newInvestment = {
            investmentId: investments,
            date: new Date()
        };
        await users.findByIdAndUpdate(id, { $push: { investments: newInvestment } }, { new: true })
        res.status(200).send('investment data saved succesfull')
        console.log(investments, 'investments details')
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

const getuserwithinvestment = async (req, res) => {
    try {
        const { id } = req.params
        const user = await users.findById(id).populate('investments.investmentId')
        if (!user) {
            res.status(400).send('user id is needed')
        }
        res.status(200).send(user)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}
const adduserkyc = async (req, res) => {
    try {
        const { id } = req.params
        const { kyc } = req.body
        await users.findByIdAndUpdate(id, { kyc: kyc }, { new: true })
        res.status(200).send('kyc added succesfully')
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

const getuserkyc = async (req, res) => {
    try {
        const { id } = req.params
        const userkyc = await users.findById(id).populate('kyc')
        res.status(200).send(userkyc)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

module.exports = { register, login, edituser, getuserwithinvestment, getUser, getuserkyc, adduserkyc }