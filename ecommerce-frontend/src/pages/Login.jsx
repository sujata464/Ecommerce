// import { useState } from 'react';
// import { TextField, Button, Container, Typography, Box } from '@mui/material';
// import API from '../api/axios';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await API.post('/login', { username, password });
//       if (res.status === 200) {
//         Cookies.set('token', res.data.token);
//         navigate('/');
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box mt={8}>
//         <Typography variant="h4" gutterBottom>Login</Typography>
//         <TextField fullWidth label="Email or Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
//         <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
//       </Box>
//     </Container>
//   );
// }
import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper
} from '@mui/material';
import API from '../api/axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/login', { username, password });
      if (res.status === 200) {
        Cookies.set('token', res.data.token);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            p: 4,
            background: '#ffffffcc',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#333' }}
          >
            Welcome Back
          </Typography>

          <TextField
            fullWidth
            label="Email or Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(to right, #667eea, #764ba2)'
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
