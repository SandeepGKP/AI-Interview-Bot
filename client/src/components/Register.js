import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Divider, IconButton } from '@mui/material';
import { Google } from '@mui/icons-material';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Google Sign-In initialization for registration
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      const scripts = document.querySelectorAll('script[src*="accounts.google.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/google', { token: response.credential });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Google registration error:', error);
      toast.error('Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google authentication not loaded');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      navigate('/login'); // Redirect after registration
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogleRegister}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Register with Google
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
