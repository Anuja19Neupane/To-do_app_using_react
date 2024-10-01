import React from 'react';

const TodoList = ({ todos, onDelete }) => {
  return (
    <div>
      <h2>Your To-Do List</h2>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            <span>{todo}</span>
            <button onClick={() => onDelete(index)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
