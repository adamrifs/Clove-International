const kyc = require('../Models/kycSchema')
const upload = require('../Middleware/multer')
const { compressImage } = require('../Middleware/multer')


const registerkyc = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Files:', req.files);

        // Define file paths for compressed images
        const photoPath = `./uploads/images/compressed-photo-${Date.now()}.jpg`;
        const govidcardPath = `./uploads/images/compressed-govidcard-${Date.now()}.jpg`;

        // Compress images using Sharp
        if (req.files.photo) {
            await compressImage(req.files.photo[0].buffer, photoPath);
        }
        if (req.files.govidcard) {
            await compressImage(req.files.govidcard[0].buffer, govidcardPath);
        }

        // Save KYC data
        const kycData = new kyc({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            bankaccountnumber: req.body.bankaccountnumber,
            bankifsc: req.body.bankifsc,
            bankbranch: req.body.bankbranch,
            photo: photoPath,
            govidcard: govidcardPath,
            data: Date.now(),
        });

        await kycData.save();
        res.status(200).json({ message: 'KYC data updated successfully', data: kycData });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal error occurred');
    }
};

const getkyc = async (req, res) => {
    try {
        const kycdata = await kyc.find()
        res.status(200).send(kycdata)

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal error occurred');
    }
}

module.exports = { registerkyc , getkyc}