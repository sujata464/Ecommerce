const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender:   { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || (req.headers['authorization']?.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, gender } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, gender });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email, gender: newUser.gender }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: username }, { name: username }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, gender: user.gender }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: "Logged out successfully" });
});

// Protected Route
app.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user
  });
});

// Home Route
app.get("/home", (req, res) => {
  res.status(200).json({ message: "Welcome to the home page!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
