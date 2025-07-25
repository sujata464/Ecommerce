import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaBox,
} from 'react-icons/fa';
import API from '../api/axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () => {
    try {
      await API.get('/profile'); // verifies token with backend
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.get('/logout');
      setIsLoggedIn(false);
      navigate('/login');
      window.location.reload();
    } catch (err) {
      alert('Logout failed');
    }
  };

  useEffect(() => {
    checkAuth(); // re-check login status on every route change
  }, [location]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🛒 E-Commerce
        </Typography>

        <Button color="inherit" component={Link} to="/">
          <FaHome style={{ marginRight: '5px' }} /> Home
        </Button>

        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/cart">
              <FaShoppingCart style={{ marginRight: '5px' }} /> Cart
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              <FaBox style={{ marginRight: '5px' }} /> Orders
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '5px' }} /> Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              <FaSignInAlt style={{ marginRight: '5px' }} /> Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              <FaUserPlus style={{ marginRight: '5px' }} /> Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
