import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login'; 
import Todo from './Todo'; 
import './index.css';

const App = () => {
  const [token, setToken] = useState(null);

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  // Handle user logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="app-container">
      {!token ? (
        <div className="auth-container">
          <h1 className="welcome-message">Welcome! Please sign up or log in.</h1>
          <span className="bold-text">Sign Up</span>
          <Signup setToken={setToken} />
          <span className="bold-text">Login</span>
          <Login setToken={setToken} />
        </div>
      ) : (
        <div className="todo-container">
          <h1>Your To-Do List</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <Todo token={token} />
        </div>
      )}
    </div>
  );
};

export default App;
