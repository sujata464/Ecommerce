import { useState } from 'react';
import {
  TextField, Button, Container, Typography, Box, Paper, MenuItem
} from '@mui/material';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', gender: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post('/register', form);
      if (res.status === 201) {
        alert("Registration successful! Please log in.");
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>Register</Typography>
        <TextField
          fullWidth name="name" label="Full Name" margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth name="email" label="Email" type="email" margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth name="password" label="Password" type="password" margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth name="confirmPassword" label="Confirm Password" type="password" margin="normal"
          onChange={handleChange}
        />
        <TextField
          fullWidth name="gender" label="Gender" select margin="normal"
          value={form.gender}
          onChange={handleChange}
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}
