const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/add', verifyToken, cartController.addToCart);
router.get('/cartItems', verifyToken, cartController.getCart);
router.delete('/remove', verifyToken, cartController.removeFromCart);

module.exports = router;
