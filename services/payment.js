const Order = require("../models/order");
const Paymob = require("./paymob");

const handleCardPayment = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "paid") throw new Error("Already paid");

     const billing = {
      first_name: order.deliveryInfo.first_name,
      last_name: order.deliveryInfo.last_name,
      email: order.deliveryInfo.email || 'na@example.com',
      phone_number: order.deliveryInfo.phone_number,
      address: order.deliveryInfo.address,
      city: order.deliveryInfo.city || 'Cairo'
    };

    if (!billing.first_name || !billing.last_name || !billing.phone_number) {
    throw new Error("Missing required billing information");
  }


  const amountCents = Math.round(order.totalPrice * 100);
    if (amountCents <= 0) {
    throw new Error("Invalid order amount");
  }
  try{

  const token = await Paymob.authenticate();
  const reg = await Paymob.registerOrder(token, `${order._id}`, amountCents, order.items);

  const key = await Paymob.generatePaymentKey(
    token,
    amountCents,
    reg.id,
    billing,
    process.env.PAYMOB_INTEGRATION_ID_CARD
  );

  order.paymentMethod = "card";
  order.paymentProvider = "paymob";
  order.paymentRef = String(reg.id);
  await order.save();

  return Paymob.iframeUrl(key);
} catch(err){
    console.error("Payment processing error:", err);
    throw new Error("Failed to process payment");
}
};

module.exports = {handleCardPayment};