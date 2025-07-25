const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
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
};

exports.logout = (req, res) => {
  res.clearCookie('token').json({ message: "Logged out successfully" });
};

exports.getProfile = (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user
  });
};
