const express = require('express')
const router = express.Router()
const investmentController = require('../Controllers/investmentController')


router.post('/addPlans', investmentController.addPlans)
router.get('/getPlans', investmentController.getPlans)
router.put('/editPlans/:id', investmentController.editPlans)
router.delete('/deletePlans/:id', investmentController.deletePlans)
router.post('/newOrderId', investmentController.newOrderId)
module.exports = router