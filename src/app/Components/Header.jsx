'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user'); // Get user data from localStorage
    if (user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name); // Assuming the user object contains a `name`
    }
  }, []); // This will run once when the component mounts

  const handleLogin = () => {
    router.push('/login'); // Redirect to login page
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    setIsLoggedIn(false);
    setUserName('');
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #ccc',
      }}
    >
      {/* Logo or App Name */}
      <Typography variant="h6">Course Portal</Typography>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px', }}>
        <Link href="/" passHref>
          <Typography
            variant="body1"
            component="a"
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              borderBottom: '2px solid transparent', // Ensure it's invisible by default
              transition: 'border-color 0.3s ease', // Smooth transition for the hover effect
            }}
            onMouseEnter={(e) => (e.target.style.borderBottom = '2px solid #1976d2')} // On hover, add bottom border
            onMouseLeave={(e) => (e.target.style.borderBottom = '2px solid transparent')} // On hover leave, remove bottom border
          >
            Home
          </Typography>
        </Link>
        <Link href="/courses" passHref>
          <Typography
            variant="body1"
            component="a"
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              borderBottom: '2px solid transparent', // Ensure it's invisible by default
              transition: 'border-color 0.3s ease', // Smooth transition for the hover effect
            }}
            onMouseEnter={(e) => (e.target.style.borderBottom = '2px solid #1976d2')} // On hover, add bottom border
            onMouseLeave={(e) => (e.target.style.borderBottom = '2px solid transparent')} // On hover leave, remove bottom border
          >
            Courses
          </Typography>
        </Link>
      </div>

      {/* Login/Logout and User Info */}
      {isLoggedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant="body1">Hello, {userName}</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      )}
    </Container>
  );
};

export default Header;
