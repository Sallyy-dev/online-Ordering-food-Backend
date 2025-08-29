const mongoose = require('mongoose');
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },


  price: { type: Number, required: true },
  image:{type: String ,required: true},
   sizes: [
    {
      size: { type: String, enum: ['small', 'medium', 'large'], required: true },
      price: { type: Number, required: true }
    }
  ],
    isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
  
});
module.exports = mongoose.model('FoodItem', foodItemSchema);
