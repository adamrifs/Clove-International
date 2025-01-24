const express = require('express')
const { adminSignup, adminLogin } = require('../Controllers/adminController')
const router = express.Router()

router.post('/admin-signup', adminSignup)
router.post('/admin-login',adminLogin)

module.exports = router