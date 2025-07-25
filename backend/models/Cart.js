//  this is the line that is used to send responce to the client to data base of cart to mongobd
const mongoose = require('mongoose');

// Define the schema for cart items
// Each item in the cart will have a productId and quantity
// This schema defines the structure of the cart in the database
// The cart will be associated with a userId to identify which user's cart it is
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 }
});

// Define the schema for the cart
// The cart will have a userId to associate it with a specific user

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
