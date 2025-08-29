const Order = require('../models/order');
const orderService = require('../services/cancelOrder');

const createOrder = async (req, res) => {
const { items, status, date , deliveryInfo ,paymentMethod = 'card'  } = req.body;

if (!items || !items.length){
return res.status(400).json({ message: 'items required' });
 } 
    if (!deliveryInfo?.first_name || !deliveryInfo?.last_name || !deliveryInfo?.phone_number || !deliveryInfo?.address) {
    return res.status(400).json({ message: 'deliveryInfo incomplete' });
    }

  try{
      for (const item of items) {
      if (!item.foodItem || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Each item must have foodItem, quantity, and price' });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }
      if (item.price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
  }

const totalPrice = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    if (totalPrice <= 0) {
      return res.status(400).json({ message: 'Total price must be greater than 0' });
  }


  const order = new Order({
    customer: req.user.userId,
    items,
    totalPrice,
    status: status || 'pending',
    deliveryInfo,
    paymentMethod,
    currency: 'EGP',
    date: date || new Date()
  });
  
    const newOrder = await order.save();
    res.status(201).json(newOrder);

}catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};


// GetAllProducts

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email") 
      .populate("items.foodItem", "name price"); 

    if ( !orders ||!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: err.message });
  }
};


const getmyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.foodItem", "name price image");
    if (!orders.length){
return res.status(404).json({ message: 'Order not found' });
    } 
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "on-the-way", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("customer", "name email")
     .populate("items.foodItem", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error while updating order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const cancelledOrder = await orderService.cancel(id, userId, userRole, reason);
    
    res.json({
      success: true,
      message: 'Cancel suceessfully',
      data: cancelledOrder
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ success: false, message: err.message });
    } else if (err.message.includes("authorized")) {
      return res.status(403).json({ success: false, message: err.message });
    } else if (err.message.includes("Cannot cancel")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    console.error('Error cancelling order:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message
    });
  }
};



module.exports = {createOrder , getAllOrders , updateOrderStatus ,getmyOrders ,cancelOrder};
