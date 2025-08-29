const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
  date: { type: Date, default: Date.now },

    cancellationReason: { type: String, default: '' },  
  cancelledAt: { type: Date }, 
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    deliveryInfo: {
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, default: 'Cairo' },
    notes: { type: String }
  },
  
  paymentMethod: { type: String, enum: ['card','wallet','fawry','cod'], default: 'cod' },
  paymentStatus: { type: String, enum: ['unpaid','paid','failed','refunded'], default: 'unpaid' },
  paymentProvider: { type: String, enum: ['paymob','fawry','paytabs', null], default: null },
  paymentRef: { type: String },         
  transactionId: { type: String },      
  currency: { type: String, default: 'EGP' },
  receiptUrl: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);
