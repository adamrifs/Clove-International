const users = require('../Models/userSchema')
const kyc = require('../Models/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const upload = require('../Middleware/multer')
const { compressImage } = require('../Middleware/multer')
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
            return res.status(500).json({ message: 'invalid email or phone number' })

        }
        const ispasswordvalid = await bcrypt.compare(password, user.password)
        if (!ispasswordvalid) {
            return res.status(500).json({ message: 'password not match' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' })
        return res.json({ message: 'login succesfull', token })
    }
    catch (error) {
        res.status(500).json({ message: 'error occured' })
        console.log(error)
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await users.findById(userId)
        if (!user) {
            res.status(400).json({ message: 'user not found' })
        }
        res.status(200).send(user)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

const getallusers = async (req, res) => {
    try {
        const findUser = await users.find()
        res.status(200).send(findUser)
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
        const updatedUser = await users.findByIdAndUpdate(id, { $push: { investments: newInvestment } }, { new: true })
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
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
const editUserDetails = async (req, res) => {
    try {
        const { id } = req.params
        const { firstname, email } = req.body
        const update = {}
        if (firstname) update.firstname = firstname;
        if (email) update.email = email;

        const user = await users.findByIdAndUpdate(id, update, { new: true })
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        res.status(200).json({ message: 'data edited succesfull', user })
    }
    catch (error) {
        console.log(error, 'internal error occured')
    }
}

const registerkyc = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await users.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const photoPath = `./uploads/images/compressed-photo-${Date.now()}.jpg`;
        const govidcardPath = `./uploads/images/compressed-govidcard-${Date.now()}.jpg`;

        if (req.files.photo) {
            await compressImage(req.files.photo[0].buffer, photoPath);
        }
        if (req.files.govidcard) {
            await compressImage(req.files.govidcard[0].buffer, govidcardPath);
        }

        user.kyc = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            bankaccountnumber: req.body.bankaccountnumber,
            bankifsc: req.body.bankifsc,
            bankbranch: req.body.bankbranch,
            photo: photoPath,
            govidcard: govidcardPath,
            data: Date.now(),
        };

        await user.save();
        res.status(200).json({ message: 'KYC data updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal error occurred');
    }
};

module.exports = { register, login, edituser, getuserwithinvestment, getUser, registerkyc, getallusers, editUserDetails }