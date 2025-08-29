// // routes/payments.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Order = require('../models/order');
// const Paymob = require('../services/paymob');

// router.post('/paymob/card', auth, async (req, res) => {
//   try {
//     const { orderId, billing } = req.body; // billing: { first_name,last_name,email,phone_number }
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Already paid' });

//     const amountCents = Math.round(order.totalPrice * 100);

//     const token = await Paymob.authenticate();
//     const reg = await Paymob.registerOrder(token, `${order._id}`, amountCents, order.items);
//     const key = await Paymob.generatePaymentKey(
//       token, amountCents, reg.id, billing, process.env.PAYMOB_INTEGRATION_ID_CARD
//     );

//     order.paymentMethod = 'card';
//     order.paymentProvider = 'paymob';
//     order.paymentRef = String(reg.id);
//     await order.save();

//     return res.json({
//       iframe_url: Paymob.iframeUrl(key) // افتحيه في فرونت-إند داخل iframe
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: e.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const paymentController = require("../controllers/payment");

router.post("/paymob/card", auth, paymentController.payWithCard);

module.exports = router;

