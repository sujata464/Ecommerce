const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports (make sure these are routers!)
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const order = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

connectDB();

// Routes
app.use('/', authRoutes);      // /register, /login, /logout
app.use('/cart', cartRoutes);  // /cart/add, /cart/remove, /cart/cartItems
app.use('/order', order);// /order/place, /order/my, /order/:id

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
