const express = require('express')
const { adminSignup, adminLogin, adminChangePassword, checkAdmin, logout, getAdmin } = require('../Controllers/adminController')
const protectRoute = require('../Middleware/adminMiddleware')
const router = express.Router()

router.post('/admin-signup', adminSignup)
router.post('/admin-login', adminLogin)
router.post('/admin-change-password', protectRoute, adminChangePassword)
router.get('/check-admin', protectRoute, checkAdmin)
router.post('/logout', logout)
router.get('/getAdmin', getAdmin)

module.exports = router