 const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

// 🛒 Place an order from cart
router.post('/place', verifyToken, orderController.placeOrder);

// 👤 Get logged-in user's orders
router.get('/my', verifyToken, orderController.getUserOrders);

// 🔎 Get order by ID
router.get('/:id', verifyToken, orderController.getOrderById);

// 🔄 Update order status (admin only - implement admin check inside controller if needed)
router.patch('/:id/status', verifyToken, orderController.updateOrderStatus);

// 🔐 Admin - Get all orders
router.get('/all', verifyToken, orderController.getAllOrders);

module.exports = router;
