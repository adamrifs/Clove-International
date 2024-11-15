const express = require('express')
const router = express.Router()
const kycController = require('../Controllers/kycController')
// const upload = require('../Middleware/multer')
const { upload } = require('../Middleware/multer');

// router.post('/registerkyc', upload.fields([
//     { name: 'photo', maxCount: 1 },
//     { name: 'govidcard', maxCount: 1 }
// ]), kycController.registerkyc);

router.post(
    '/registerkyc',
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'govidcard', maxCount: 1 },
    ]),
    kycController.registerkyc
);


module.exports = router