// src/pages/ProductDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/product/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.error('Failed to fetch product', err);
    }
  };

  const addToCart = async () => {
    try {
      await API.post('/cart/add', {
        productId: product._id,
        quantity: parseInt(quantity),
      });

      alert("Product added to cart ✅");
    } catch (err) {
      console.error("Failed to add to cart", err);

      // If user is not authenticated, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Please log in to add to cart");
        navigate('/login');
      } else {
        alert("Error adding to cart");
      }
    }
  };

  if (!product) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<FaArrowLeft />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>

      <Card>
        <CardMedia
          component="img"
          height="400"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h4">{product.name}</Typography>
          <Typography variant="h6" color="text.secondary">
            ₹ {product.price}
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {product.description}
          </Typography>
          <Typography variant="body2">Category: {product.category}</Typography>
          <Typography variant="body2">Ratings: {product.ratings}</Typography>

          <Box display="flex" alignItems="center" gap={2} mt={3}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ width: '100px' }}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addToCart}
              startIcon={<FaCartPlus />}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
