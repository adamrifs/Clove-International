const { Cashfree } = require('cashfree-pg');
require('dotenv').config();

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

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        console.log("Order created successfully:", response.data);

        res.status(200).json({ payment_session_id: response.data.payment_session_id });
    }
    catch (error) {
        console.error("Error:", error.response?.data?.message || error.message);
        res.status(500).json({ error: error.response?.data?.message || "Internal error occurred" });
    }
}

module.exports = { newOrderId }