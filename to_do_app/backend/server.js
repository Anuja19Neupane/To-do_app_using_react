const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000; // Changed port to 5001
const SECRET_KEY = 'your_secret_key'; // Change this to a secure key in a real application

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Users storage (could be a database in real applications)
const users = [];

// Load todos from JSON file
const loadTodos = () => {
  const filePath = path.join(__dirname, 'todos.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      console.log('Todos loaded:', data); // Debugging log
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading todos file:', err);
      return {};
    }
  }
  return {}; // Return an empty object if the file does not exist
};

// Save todos to JSON file
const saveTodos = (todos) => {
  const filePath = path.join(__dirname, 'todos.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
    console.log('Todos saved:', todos); // Debugging log
  } catch (err) {
    console.error('Error writing todos file:', err);
  }
};

// Load todos from file at server startup
let todos = loadTodos(); // Load existing todos

// Middleware to authenticate user
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
  if (!token) {
    return res.sendStatus(403); // Forbidden
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Store user info in request
    next();
  });
};

// Signup endpoint
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Save user
  users.push({ email, password });
  todos[email] = []; // Initialize an empty todo array for the new user
  saveTodos(todos); // Save the new state of todos
  res.status(200).json({ message: 'Signup successful', token: generateToken({ email }) });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the user exists
  const user = users.find(user => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate a token
  const token = generateToken({ email });
  res.status(200).json({ message: 'Login successful', token });
});

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
};

// Get all todos for the logged-in user
app.get('/todos', authenticateJWT, (req, res) => {
  const userEmail = req.user.email; // Use the authenticated user's email
  res.json(todos[userEmail] || []); // Return the user's todos
});

// Create a new todo for the logged-in user
app.post('/todos', authenticateJWT, (req, res) => {
  const userEmail = req.user.email; // Use the authenticated user's email
  const { text } = req.body;

  // Basic validation
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newTodo = { id: Date.now(), text }; // Simple ID generation
  todos[userEmail].push(newTodo); // Add todo to the user's array
  saveTodos(todos); // Save updated todos
  res.status(201).json(newTodo); // Send back the created todo
});

// Delete a todo for the logged-in user
app.delete('/todos/:id', authenticateJWT, (req, res) => {
  const userEmail = req.user.email; // Use the authenticated user's email
  const { id } = req.params;

  // Filter todos for the user
  todos[userEmail] = todos[userEmail].filter(todo => todo.id !== Number(id));
  saveTodos(todos); // Save updated todos
  res.status(204).send(); // No content
});

// Update a todo for the logged-in user
app.put('/todos/:id', authenticateJWT, (req, res) => {
  const userEmail = req.user.email; // Use the authenticated user's email
  const { id } = req.params;
  const { text } = req.body;

  // Find the todo by id
  const todoIndex = todos[userEmail].findIndex(todo => todo.id === Number(id));
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Update the todo text
  todos[userEmail][todoIndex].text = text;
  saveTodos(todos); // Save updated todos
  res.json(todos[userEmail][todoIndex]); // Return the updated todo
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
