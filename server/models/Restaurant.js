const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  cuisine: [{ type: String }],
  address: {
    street: String,
    city: String
  },
  image: { type: String },
  isOpen: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number }, // in minutes
  minimumOrder: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
