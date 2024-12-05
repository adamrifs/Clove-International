const express = require('express')
const router = express.Router()
const paymentController = require('../Controllers/paymentController')


router.get('/newOrderId', paymentController.newOrderId)

module.exports = router