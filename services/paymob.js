const axios = require('axios');

const PAYMOB_BASE = 'https://accept.paymob.com/api';
const {
  PAYMOB_API_KEY, PAYMOB_IFRAME_ID,
  PAYMOB_INTEGRATION_ID_CARD, PAYMOB_INTEGRATION_ID_WALLET
} = process.env;

if (!PAYMOB_API_KEY || !PAYMOB_IFRAME_ID || !PAYMOB_INTEGRATION_ID_CARD) {
  console.error('Missing required Paymob environment variables');
}

async function authenticate() {
  try {
    const { data } = await axios.post(`${PAYMOB_BASE}/auth/tokens`, { 
      api_key: PAYMOB_API_KEY 
    });
    return data.token;
  } catch (error) {
    console.error('Paymob authentication error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Paymob');
  }
}

// console.log("API_KEY:", process.env.PAYMOB_API_KEY);

async function registerOrder(token, merchantOrderId, amountCents, items=[]) {
  try{
  const { data } = await axios.post(`${PAYMOB_BASE}/ecommerce/orders`, {
    auth_token: token,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: "EGP",
    merchant_order_id: merchantOrderId,
    items: items.map(it => ({
      name: it.name, amount_cents: Math.round(it.price * 100),
      quantity: it.quantity, description: it.size || ''
    }))
  });
  return data; 
}catch (error) {
    console.error('Paymob register order error:', error.response?.data || error.message);
    throw new Error('Failed to register order with Paymob');
  }
}

async function generatePaymentKey(token, amountCents, orderId, billingData, integrationId) {
  try{
        if (!billingData.email || !billingData.first_name || !billingData.last_name || !billingData.phone_number) {
      throw new Error('Missing required billing data');
    }
  const { data } = await axios.post(`${PAYMOB_BASE}/acceptance/payment_keys`, {
      auth_token: token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: billingData.apartment || "NA",
        email: billingData.email,
        floor: billingData.floor || "NA", 
        first_name: billingData.first_name,
        street: billingData.street || billingData.address || "NA",
        building: billingData.building || "NA",
        phone_number: billingData.phone_number,
        shipping_method: billingData.shipping_method || "NA", 
        postal_code: billingData.postal_code || "NA", 
        city: billingData.city || "Cairo",
        country: billingData.country || "EG", 
        last_name: billingData.last_name, 
        state: billingData.state || "Cairo"
    },
    currency: "EGP",
    integration_id: integrationId
  });
  return data.token;
} 
catch (error) {
    console.error('Paymob payment key generation error:', error.response?.data || error.message);
    throw new Error('Failed to generate payment key');
  }
}

function iframeUrl(paymentKey) {
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

async function createPayment(req, res) {
  try {
    const { amountCents, items, billingData ,merchantOrderId  } = req.body;

    if (!amountCents || !billingData) {
      return res.status(400).json({ success: false,error: 'amountCents and billingData are required'});
    }

    const authToken = await authenticate();

    const order = await registerOrder(
      authToken, 
      merchantOrderId || Date.now(), 
      amountCents, 
      items || []
    );
    
    const paymentKey = await generatePaymentKey(
      authToken,
      amountCents,
      order.id,
      billingData,
      PAYMOB_INTEGRATION_ID_CARD 
    );


    const url = iframeUrl(paymentKey);
    res.status(200).json({ success: true, iframeUrl: url , orderId: order.id  });
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
}




module.exports = {
  authenticate, registerOrder, generatePaymentKey,createPayment,iframeUrl
};





// https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`
