'use client';

import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    // Send registration request to API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Handle successful registration
      console.log('Registration successful', data);
  
      // Now send a login request to automatically log in the user
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Use the same email and password for login
      });
  
      const loginData = await loginResponse.json();
  
      if (loginResponse.ok) {
        // Handle successful login (e.g., store token or user data)
        console.log('Login successful', loginData);
  
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({ name: loginData.user.name }));
  
        // Redirect to courses page
        router.push('/courses'); // Redirect to the courses page after login
      } else {
        setError(loginData.error || 'Login failed after registration');
      }
    } else {
      setError(data.error || 'Registration failed');
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ marginTop: '100px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px', mb: '100px' }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
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
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
