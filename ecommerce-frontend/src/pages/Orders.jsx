import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Box,
} from '@mui/material';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/order/my'); // ✅ Fetch user's own orders
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Loading orders...</Typography>;

  if (orders.length === 0)
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>No orders placed yet.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Orders</Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Order ID: {order._id}</Typography>
                <Typography variant="subtitle2">Status: {order.orderStatus}</Typography>
                <Typography variant="subtitle2">Payment: {order.paymentStatus}</Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Total: ₹{order.totalAmount.toFixed(2)}
                </Typography>

                <Divider sx={{ mb: 1 }} />

                {order.products.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography><strong>{item.productId.name}</strong></Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                    <Typography variant="body2">Price: ₹{item.productId.price}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
