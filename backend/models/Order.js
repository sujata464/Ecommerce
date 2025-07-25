const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, default: 'Placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
