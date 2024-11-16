const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')
const userMiddleware = require('../Middleware/userMiddleware')


router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getUser', userController.getUser)
router.put('/edituser/:id', userMiddleware, userController.edituser)
router.get('/getuserwithinvestment/:id', userController.getuserwithinvestment)
router.get('/getuserkyc/:id', userController.getuserkyc)
router.put('/adduserkyc/:id', userController.adduserkyc)
module.exports = router