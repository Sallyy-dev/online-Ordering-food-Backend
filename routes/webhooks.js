
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/order');

const { PAYMOB_HMAC } = process.env;


function verifyHmac(query) {
  const orderKeys = [
    'amount_cents','created_at','currency','error_occured','has_parent_transaction',
    'id','integration_id','is_3d_secure','is_auth','is_capture','is_refunded','is_standalone_payment',
    'is_voided','order','owner','pending','source_data.pan','source_data.sub_type','source_data.type','success'
  ];
  const concat = orderKeys.map(k => (query[k] ?? '')).join('');
  const hmac = crypto.createHmac('sha512', PAYMOB_HMAC).update(concat).digest('hex');
  return hmac === query.hmac;
}

router.post('/paymob', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const data = req.body; // أو req.query حسب إعدادك
    if (!verifyHmac(data)) return res.status(403).send('Invalid HMAC');

    const success = String(data.success) === 'true';
    const paymobOrderId = data.order;

    const order = await Order.findOne({ paymentRef: String(paymobOrderId) });
    if (!order) return res.status(404).send('Order not found');

    if (success) {
      order.paymentStatus = 'paid';
      order.status = 'completed';
      order.transactionId = data.id;
      order.receiptUrl = ''; 
    } else {
      order.paymentStatus = 'failed';
    }
    await order.save();
    res.send('ok');
  } catch (e) {
    console.error(e);
    res.status(500).send('err');
  }
});

module.exports = router;
