const express = require('express')
const router = express.Router()
const upload = require('../Middleware/multer')
const { uploadFile } = require('../Controllers/uploadController')

router.post('/upload', upload.single('image'), uploadFile)

module.exports = router