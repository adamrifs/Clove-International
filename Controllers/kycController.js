const kyc = require('../Models/kycSchema')
const upload = require('../Middleware/multer')

// const registerkyc = async (req, res) => {
//     try {
//         const kycData = new kyc(req.body)
//         await kycData.save()
//         res.status(200).json({ message: 'kyc data updated succesfully', data: kycData })
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).send('internal error occured')
//     }
// }

// const registerkyc = async (req, res) => {
//     try {
//         upload.fields([
//             { name: 'photo', maxCount: 1 },
//             { name: 'govidcard', maxCount: 1 }
//         ])(req, res, async (err) => {
//             if (err) {
//                 return res.status(400).json({ message: 'File upload failed', error: err });
//             }

//             const kycData = new kyc({
//                 name: req.body.name,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 age: req.body.age,
//                 address: req.body.address,
//                 city: req.body.city,
//                 pincode: req.body.pincode,
//                 state: req.body.state,
//                 bankaccountnumber: req.body.bankaccountnumber,
//                 bankifsc: req.body.bankifsc,
//                 bankbranch: req.body.bankbranch,
//                 photo: req.files.photo ? req.files.photo[0].path : null,
//                 govidcard: req.files.govidcard ? req.files.govidcard[0].path : null,
//                 data: Date.now()
//             })

//             await kycData.save()
//             console.log(req.body)
//             console.log('files::', req.files)
//             res.status(200).json({ message: 'KYC data updated successfully', data: kycData });

//         })
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).send('Internal error occurred');
//     }
// }

const registerkyc = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Debugging line
        console.log('Files:', req.files);        // Debugging line

        // Creating the new KYC document
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
            photo: req.files && req.files.photo ? req.files.photo[0].path : null,
            govidcard: req.files && req.files.govidcard ? req.files.govidcard[0].path : null,            
            data: Date.now()
        });

        await kycData.save();
        res.status(200).json({ message: 'KYC data updated successfully', data: kycData });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal error occurred');
    }
};

module.exports = { registerkyc }