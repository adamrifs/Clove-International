const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')
const userMiddleware = require('../Middleware/userMiddleware')
const {upload} = require('../Middleware/multer')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getUser', userMiddleware, userController.getUser)
router.put('/edituser/:id', userMiddleware, userController.edituser)
router.get('/getuserwithinvestment/:id', userController.getuserwithinvestment)
router.post(
    '/registerkyc',
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'govidcard', maxCount: 1 },
    ]),
    kycController.registerkyc
);
// router.get('/getuserkyc/:id', userController.getuserkyc)
// router.put('/adduserkyc/:id', userController.adduserkyc)
module.exports = router