const express = require('express')
const router = express.Router()
const kycController = require('../Controllers/kycController')


router.post('/registerkyc',kycController.registerkyc)

module.exports = router