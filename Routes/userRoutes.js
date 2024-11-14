const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')

router.post('/register', userController.register)
router.post('/login',userController.login)
router.get('/getUser',userController.getUser)
router.put('/edituser/:id',userController.edituser)
router.get('/getuserwithinvestment/:id',userController.getuserwithinvestment)
module.exports = router