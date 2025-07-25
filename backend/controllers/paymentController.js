const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Razorpay order creation failed", error: error.message });
  }
};
