import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart/cartItems');
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        alert("Please login to view your cart.");
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete('/cart/remove', {
        data: { productId }, // send in body for DELETE
      });
      fetchCart();
    } catch (err) {
      alert("Failed to remove item");
      console.error(err);
    }
  };

  const placeOrder = async () => {
    try {
      await API.post('/order/place'); // implement this route in backend
      alert("Order placed successfully!");
      fetchCart(); // refresh cart
    } catch (err) {
      alert("Failed to place order");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Loading...</Typography>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Your cart is empty 🛒</Typography>
      </Container>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    const price = Number(item.productId.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>

      <Grid container spacing={3}>
        {cart.items.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.productId._id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={item.productId.image}
                alt={item.productId.name}
              />
              <CardContent>
                <Typography variant="h6">{item.productId.name}</Typography>
                <Typography>Price: ₹{item.productId.price}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<FaTrash />}
                  onClick={() => removeItem(item.productId._id)}
                  sx={{ mt: 2 }}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} textAlign="right">
        <Typography variant="h6">Total: ₹{total.toFixed(2)}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaShoppingBag />}
          onClick={placeOrder}
          sx={{ mt: 2 }}
        >
          Place Order
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
