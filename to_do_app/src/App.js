import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login'; 
import Todo from './Todo'; 

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {!token ? (
        <div>
          <h1>Welcome! Please sign up or log in.</h1>
          <Signup setToken={setToken} />
          <Login setToken={setToken} />
        </div>
      ) : (
        <div>
          <h1>Your To-Do List</h1>
          <button onClick={handleLogout}>Logout</button>
          <Todo token={token} />
        </div>
      )}
    </div>
  );
};

export default App;
