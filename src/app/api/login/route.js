// File: /pages/api/login.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Ensure Prisma is set up correctly

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Please fill in both fields' }),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET, // Use your secret key here
      { expiresIn: '1h' }
    );

    // Prepare user data to return
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    // Return user data and token in response
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: userData,
        token,
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again later.' }),
      { status: 500 }
    );
  }
}
