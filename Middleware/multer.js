const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


const storage = multer.memoryStorage(); // Temporarily store files in memory

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the initial file upload to 5MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only');
    }
}

// Function to compress image
const compressImage = async (buffer, outputPath) => {
    await sharp(buffer)
        .resize({ width: 1024 }) // Resize to a maximum width of 1024px
        .jpeg({ quality: 80 }) // Compress to 80% quality
        .toFile(outputPath);
};


// module.exports = upload;
module.exports = { upload, compressImage };