import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Container,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/product');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right top, #fdfbfb, #ebedee)',
        minHeight: '100vh',
        py: 6
      }}
    >
      <Container>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.secondary.main,
            mb: 6,
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          Explore Our Colorful Products
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid
              item
              key={product._id}
              xs={12}
              sm={6}
              md={4}
              lg={2}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  width: 250,
                  height: 370,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 6,
                  background: 'linear-gradient(to bottom right, #ffffff, #f0f4ff)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#333' }}
                    gutterBottom
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    ₹ {product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {product.description.slice(0, 60)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/product/${product._id}`}
                    startIcon={<FaInfoCircle />}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 2
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
