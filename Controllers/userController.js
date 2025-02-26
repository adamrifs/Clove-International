const users = require('../Models/userSchema')
const kyc = require('../Models/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const upload = require('../Middleware/multer')
const { compressImage } = require('../Middleware/multer')
const path = require('path')
const fs = require('fs');
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

const addUserImage = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadDir = path.join(__dirname, '../uploads/userimages');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${userId}-${Date.now()}.jpeg`;
        const filePath = path.join(uploadDir, fileName);

        // Compress and save the image
        await compressImage(req.file.buffer, filePath);

        const updatedImage = await users.findByIdAndUpdate(userId,
            { userimage: `/uploads/userimages/${fileName}` },
            { new: true })
        res.status(200).json({ message: 'profile picture updated ', updatedImage })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal error occured', error })
    }
}

const updateUserimage = async (req, res) => {
    try {
        const { id } = req.params
        if (!req.file) {
            return res.status(400).json({ message: "no file updated" })
        }

        const uploadDir = path.join(__dirname, '../uploads/userimages')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const user = await users.findById(id)
        if (!user) {
            res.status(404).json({ message: 'user not found' })
        }

        if (user.userimage) {
            const oldpath = path.join(__dirname, `..${user.userimage}`)
            if (fs.existsSync(oldpath)) {
                fs.unlinkSync(oldpath)
            }
        }

        const fileName = `${id}-${Date.now()}.jpeg`
        const filepath = path.join(uploadDir, fileName)

        await compressImage(req.file.buffer, filepath)

        const updatedImage = await users.findByIdAndUpdate(id,
            { userimage: `/uploads/userimages/${fileName}` },
            { new: true }
        )
        res.status(200).json({ message: 'Profile picture updated successfully', updatedImage });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal error occured', error })
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

const approveInvestment = async (req, res) => {
    try {
        const { id: userId, investmentid: investmentId } = req.params
        const { status } = req.body
        const updatedUserInvestment = await users.findOneAndUpdate(
            { _id: userId, 'investments.investmentId': investmentId },
            { $set: { 'investments.$.status': status } },
            { new: true }
        )
        res.status(200).json({ message: 'succesfully updated status', updatedUserInvestment })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something error occured' })
    }
}

const investmentStatus = async (req, res) => {
    try {

        const user = await users.find()
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        const allInvestmentStatus = user.map(user => ({
            userId: user._id,
            investments: user.investments.map(investment => ({
                investmentId: investment.investmentId,
                status: investment.status
            }))
        }))
        res.status(200).json({ message: 'successfull', allInvestmentStatus })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'error on investmentStatus' })
    }
}
const addPercentage = async (req, res) => {
    try {
        const { userId,  percentage } = req.body
        const user = await users.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        user.percentage = percentage
        await user.save()
        res.status(200).json({ message: 'Percentage Updated'  })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'error on editPercentage' })
    }
}

const editUserDetails = async (req, res) => {
    try {
        const { id } = req.params
        const { firstname, email, phone, } = req.body
        const update = {}
        if (firstname) update.firstname = firstname;
        if (email) update.email = email;
        if (phone) update.phone = phone;

        const user = await users.findByIdAndUpdate(id, update, { new: true })
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        res.status(200).json({ message: 'data edited succesfull', user })
    }
    catch (error) {
        console.log(error, 'Internal error occurred');
        res.status(500).json({ message: 'Internal server error' });
    }
}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newPassword, currentPassword } = req.body
        const user = await users.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'current password not equal' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: 'password changed succesfull' })
    }
    catch (error) {
        console.log(error, 'Internal error occurred');
        res.status(500).json({ message: 'Internal server error' });
    }
}

const registerkyc = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await users.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const photoFile = req.files.photo ? req.files.photo[0] : null;
        const govidFile = req.files.govidcard ? req.files.govidcard[0] : null;

        let photoPath = null;
        let govidcardPath = null;

        if (photoFile) {
            photoPath = `uploads/images/compressed-photo-${Date.now()}.jpg`;
            await compressImage(photoFile.buffer, path.join(__dirname, '../', photoPath));
        }

        if (govidFile) {
            govidcardPath = `uploads/images/compressed-govidcard-${Date.now()}.jpg`;
            await compressImage(govidFile.buffer, path.join(__dirname, '../', govidcardPath));
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
            photo: photoPath ? `/${photoPath}` : null, // Save relative path for frontend use
            govidcard: govidcardPath ? `/${govidcardPath}` : null,
            data: Date.now(),
        };

        await user.save();
        res.status(200).json({ message: 'KYC data updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal error occurred');
    }
};

const moneyWithdraw = async (req, res) => {
    try {
        const id = req.user.id
        const { amount } = req.body
        const user = await users.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        user.withdraw.push({ amount })
        await user.save()
        res.status(200).json({ message: 'withdraw amount added', user })
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message, 'error occured on money witdraw');
    }
}
const withdrawStatus = async (req, res) => {
    try {
        const { id, withdrawId, status } = req.body
        const user = await users.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const withdraw = user.withdraw.id(withdrawId)
        if (!withdraw) {
            return res.status(404).json({ message: 'withdrawId  not found' })
        }
        withdraw.status = status
        await user.save()
        res.status(200).json({ message: 'Withdraw status updated', withdraw });

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message, 'error occured on money witdraw');
    }
}

module.exports = {
    register, login, edituser, getuserwithinvestment, getUser, registerkyc,
    getallusers, editUserDetails, changePassword, addUserImage, updateUserimage, approveInvestment,
    investmentStatus, moneyWithdraw, withdrawStatus ,addPercentage
}