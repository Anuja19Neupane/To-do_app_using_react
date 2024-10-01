import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setMessage('Signup successful! You can now log in.');
    } catch (error) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
