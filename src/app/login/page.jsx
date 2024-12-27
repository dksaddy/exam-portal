'use client';

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text(); // Get raw response text
      console.log("Raw Response Text:", text);  // Log raw text to inspect it

      let data = {};
      try {
        data = JSON.parse(text); // Attempt to parse the raw text as JSON
      } catch (e) {
        throw new Error('Response is not valid JSON');
      }

      console.log("Parsed JSON Response:", data);  // Log parsed response

      if (response.status !== 200) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // If user is an admin, redirect to admin page
      if (data.user.status === 'admin') {
        router.push('/admin');
      } else {
        router.push('/'); // Redirect to homepage or user dashboard
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', error); // Log the error for debugging
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '100px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', mb: '100px' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>

      <Typography variant="body2" style={{ marginTop: '10px' }}>
        Don't have an account?{' '}
        <Link href="/register" passHref>
          Register
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
