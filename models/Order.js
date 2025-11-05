const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
     orderId: String, 
    cartItems: Array,
    totalAmount: Number,
    paymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'in process', 'out for delivery', 'delivered'],
      default: 'pending',
    },
    customerInfo: {
      firstName: String,
      lastName: String,
      contactNumber: String,
      email: String,
      homeAddress: String,
      area: String,
      city: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
