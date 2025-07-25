const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout); // Use GET not POST

// ✅ Auth-protected profile route
router.get('/profile', verifyToken, authController.getProfile);

// ✅ Product routes
router.post('/addProduct', verifyToken, productController.addProduct);
router.get('/product',verifyToken, productController.getAllProducts); // public access to view all
router.get('/product/:id', verifyToken ,productController.getProductsById); // public access to view one
router.get('/product/category/:category',verifyToken, productController.getProductsByCategory);
router.post('/product/many', verifyToken, productController.addMultipleProducts);

// ✅ Test route
router.get('/home', (req, res) => {
  res.status(200).json({ message: "Welcome to the home page!" });
});

module.exports = router;
