const investmentplans = require('../Models/investmentShcema')
const { Cashfree } = require('cashfree-pg');
require('dotenv').config();

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


Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const newOrderId = async (req, res) => {
    try {
        const uniqueOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 100000)}`

        let request = {
            "order_amount": req.body.order_amount,
            "order_currency": "INR",
            "order_id": uniqueOrderId,
            "customer_details": {
                "customer_id": req.body.customer_id,
                "customer_phone": req.body.customer_phone,
                "customer_name": req.body.customer_name,
                "customer_email": req.body.customer_email
            },
            "order_meta": {
                "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
                "payment_methods": "cc,dc,upi"
            }
        };

        Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
            console.log('Order created successfully:', response.data);
        }).catch((error) => {
            console.error('Error:', error.response.data.message);
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send('internal error occured')
    }
}
module.exports = { addPlans, getPlans, editPlans, deletePlans, newOrderId }