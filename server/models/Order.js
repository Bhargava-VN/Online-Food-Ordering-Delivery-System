const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number }
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    zip: String
  },
  paymentMethod: { type: String, enum: ['card', 'cod'], default: 'card' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentIntentId: { type: String },
  estimatedDeliveryTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
