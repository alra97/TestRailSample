import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login request to backend API
  const handleLogin = async () => {
    try {
      // Send the username and password to the backend login endpoint
      const response = await axios.post('http://localhost:5000/login', { username, password });

      // Assuming backend returns user data (id and username) upon successful login
      const { id, username: loggedInUsername } = response.data;

      // Store user information in local storage
      localStorage.setItem('userId', id);
      localStorage.setItem('username', loggedInUsername);

      // Redirect to quiz page
      navigate('/quiz');
    } catch (err) {
      // Handle errors (like invalid credentials or backend issues)
      console.error('Login error:', err);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
