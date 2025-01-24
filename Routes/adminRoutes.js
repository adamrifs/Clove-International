const express = require('express')
const { adminSignup, adminLogin, adminChangePassword } = require('../Controllers/adminController')
const router = express.Router()

router.post('/admin-signup', adminSignup)
router.post('/admin-login',adminLogin)
router.post('/admin-change-password/:id', adminChangePassword)

module.exports = router