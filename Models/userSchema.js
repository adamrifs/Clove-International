const mongoose = require('mongoose')
const investmentplans = require('./investmentShcema')
const kyc = require('./kycSchema')

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    c_password: { type: String },
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    kyc: { type: mongoose.Schema.Types.ObjectId, ref: 'kyc' },
    investments: [{
        investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'investmentplans' },
        date: { type: Date, default: Date.now }
    }]
})

const users = mongoose.model('users', userSchema)
module.exports = users