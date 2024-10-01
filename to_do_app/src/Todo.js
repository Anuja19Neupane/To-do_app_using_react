import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

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

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/todos',
        { text: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Create todo error:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Delete todo error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
      <h2 className="text-center text-2xl font-bold py-4">Your To-Do List</h2>
      <form className="flex justify-between p-4" onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 mr-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add</button>
      </form>
      <ul className="list-none">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center border-b border-gray-200 p-4">
            <span>{todo.text}</span>
            <button 
              onClick={() => handleDeleteTodo(todo.id)} 
              className="bg-red-500 text-white px-2 py-1 rounded-lg"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
