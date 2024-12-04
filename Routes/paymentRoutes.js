const express = require('express')
const router = express.Router()
const paymentController = require('../Controllers/paymentController')


router.post('/newOrderId', paymentController.newOrderId)

module.exports = router