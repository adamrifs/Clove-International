const mongoose = require('mongoose')

const investmentSchema = new mongoose.Schema({
    capital: { type: Number, required: true },
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true },
    type: { type: String, required: true }
})

const investmentplans = mongoose.model('investmentplans', investmentSchema)
module.exports = investmentplans