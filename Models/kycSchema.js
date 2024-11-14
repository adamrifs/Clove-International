const mongoose = require('mongoose')

const kycSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number },
    address: { type: String },
    city: { type: String },
    pincode: { type: Number },
    state: { type: String },
    bankaccountnumber: { type: Number },
    bankifsc: { type: Number },
    bankbranch: { type: String },
    photo: { type: String },
    govidcard: { type: String },
    date: { type: Date, default: Date.now }
})
const kyc = mongoose.model('kyc', kycSchema)
module.exports = kyc