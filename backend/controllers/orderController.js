const Cart = require('../models/Cart');
const Order = require('../models/Order');

// ✅ Place Order from Cart
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const products = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity
    }));

    const totalAmount = cart.items.reduce((sum, item) => {
      const price = Number(item.productId.price); // Ensure price is a number
      return sum + price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      products,
      totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Placed"
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// ✅ Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId userId');
    res.status(200).json({ message: "All orders fetched", orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// ✅ Get Orders of Logged-in User
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId }).populate('products.productId');
    res.status(200).json({ message: "User orders fetched", orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error: error.message });
  }
};

// ✅ Get Order by ID
exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId).populate('products.productId userId');
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order fetched", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// ✅ Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};
