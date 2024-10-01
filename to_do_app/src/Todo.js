import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch all todos when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Fetch todos error:', error);
      }
    };
    fetchTodos();
  }, [token]);

  // Handle creating a new todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return; // Ensure the todo is not empty

    try {
      const response = await axios.post(
        'http://localhost:5000/todos',
        { text: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data]);
      setNewTodo(''); // Clear input field after adding
    } catch (error) {
      console.error('Create todo error:', error);
    }
  };

  // Handle deleting a specific todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.id !== id)); // Use correct id for comparison
    } catch (error) {
      console.error('Delete todo error:', error);
    }
  };

  // Handle updating a todo
  const handleUpdateTodo = async (id, updatedText) => {
    if (!updatedText.trim()) return; // Ensure the todo is not empty
    try {
      const response = await axios.put(
        `http://localhost:5000/todos/${id}`,
        { text: updatedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(
        todos.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (error) {
      console.error('Update todo error:', error);
    }
  };

  return (
    <div>
      <h2>Your To-Do List</h2>
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="text"
              value={todo.text}
              onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
