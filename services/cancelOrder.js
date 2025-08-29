const Order = require('../models/order');

exports.cancel = async (orderId, userId, userRole, reason = '') => {
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }

    const isOwner = order.customer.toString() === userId;
    const isAdmin = userRole === 'admin';
    
    if (!isOwner && !isAdmin) {
      throw new Error("Not authorized to cancel this order");
    }

    const cannotCancelStates = ['delivered', 'canceled', 'refunded'];
    if (cannotCancelStates.includes(order.status)) {
      throw new Error("Cannot cancel order in its current state");
    }

    order.status = 'canceled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    order.cancelledBy = userId;
    
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};