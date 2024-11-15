const mongoose = require('mongoose')

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
const kyc = mongoose.model('kyc', kycSchema)
module.exports = kyc