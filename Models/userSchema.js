const mongoose = require('mongoose')
const investmentplans = require('./investmentShcema')

const kycSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    bankaccountnumber: { type: Number, required: true },
    bankifsc: { type: String, required: true },
    bankbranch: { type: String, required: true },
    photo: { type: String, required: true },
    govidcard: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    c_password: { type: String },
    userimage: { type: String },
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    kyc: kycSchema,
    withdraw: [{
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
    }],
    investments: [{
        investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'investmentplans' },
        status: { type: String, enum: ['approved', 'dissaproved', 'pending'], default: 'pending' },
        date: { type: Date, default: Date.now }
    }]
})

const users = mongoose.model('users', userSchema)
module.exports = users