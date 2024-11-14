const kyc = require('../Models/kycSchema')

const registerkyc = async (req, res) => {
    try {
        const kycData = new kyc(req.body)
        await kycData.save()
        res.status(200).json({ message: 'kyc data updated succesfully', data: kycData })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('internal error occured')
    }
}

module.exports = { registerkyc }