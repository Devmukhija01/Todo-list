import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleToggleCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, completed: !task.completed } : task);
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].text);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (editTask.trim()) {
      const updatedTasks = tasks.map((task, i) => i === editIndex ? { ...task, text: editTask } : task);
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditTask('');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      if (sortOrder === 'asc') {
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      } else {
        return textA > textB ? -1 : textA < textB ? 1 : 0;
      }
    });
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
  );

  const sortedAndFilteredTasks = sortTasks(filteredTasks);

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add a New Task" 
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="controls">
        <div className="select">
          <label>
            Filter: 
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </label>
        </div>
        <div className="select">
          <label>
            Sort: 
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>
      <ul>
        {sortedAndFilteredTasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            {editIndex === index ? (
              <form onSubmit={handleUpdateTask}>
                <input 
                  type="text" 
                  value={editTask} 
                  onChange={(e) => setEditTask(e.target.value)} 
                />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditIndex(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span onClick={() => handleToggleCompletion(index)}>{task.text}</span>
                <button onClick={() => handleEditTask(index)}>Edit</button>
                <button onClick={() => handleRemoveTask(index)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
