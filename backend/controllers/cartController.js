const Cart = require('../models/Cart');

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

// ✅ Remove from Cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// ✅ Get Cart
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(200).json({ message: "Cart is empty", items: [] });

    res.status(200).json({ message: "Cart retrieved", cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};
