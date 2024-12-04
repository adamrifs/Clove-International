const investmentplans = require('../Models/investmentShcema')


const addPlans = async (req, res) => {
    try {
        const { capital, monthly, yearly, type } = req.body
        const newPlans = new investmentplans({ capital, monthly, yearly, type })
        await newPlans.save()
        res.status(200).json({ message: 'data save' })
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getPlans = async (req, res) => {
    try {
        const Plans = await investmentplans.find()
        res.status(200).send(Plans)
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error)

    }
}

const editPlans = async (req, res) => {
    try {
        const { id } = req.params
        const { capital, monthly, yearly, type } = req.body
        await investmentplans.findByIdAndUpdate(id,
            { capital, monthly, yearly, type },
            { new: true }
        )
        res.status(200).json({ message: 'update success' })
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}

const deletePlans = async (req, res) => {
    try {
        const { id } = req.params
        await investmentplans.findByIdAndDelete(id)
        res.status(200).send('deleted')
    }
    catch (error) {
        console.log(error)
        res.status(500).send('error occured')
    }
}



module.exports = { addPlans, getPlans, editPlans, deletePlans }