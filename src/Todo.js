import React from 'react'

const Todo = ({ todo,toggltTodo }) => {
    const handleTodoClick = () => {
        toggltTodo(todo.id);
    }
  return (
  <div>
    <label>
        <input
        type='checkbox'
        checked={todo.completed}
        readOnly
        onChange={handleTodoClick}
        />
    </label>
    {todo.name}
  </div>
  );
};

export default Todo;