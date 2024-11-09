import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../styles/TaskManager.css';
import TaskColumn from '../components/TaskColumn';
import SearchAndSort from '../components/SearchAndSort';
import TaskModal from '../components/TaskModal';
import { get, post, put } from '../services/sendRequest';
import Loader from '../components/Loader';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createTask, setCreateTask] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await get('/tasks');
      if (response.status?.toUpperCase() === 'SUCCESS') {
        setTasks(response.data);
      } else {
        setError('Failed to fetch tasks. Please try again later.');
      }
    } catch (error) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, fromColumn, toColumn) => {
    setLoading(true);

    try {
      const response = await put(`/tasks/${taskId}`, { status: toColumn });
      if (response.status?.toUpperCase() === 'SUCCESS') {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId && task.status === fromColumn
            ? { ...task, status: toColumn }
            : task
        );
        updatedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setTasks(updatedTasks);
      } else {
        setError('Failed to move task. Please try again.');
      }
    } catch (error) {
      setError('Failed to move task. Please try again later.');
      console.error('Move task error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title, description) => {
    setLoading(true);
    const newTaskData = {
      title,
      description,
      status: 'TODO',
    };

    try {
      const response = await post('/tasks', newTaskData);
      if (response.status?.toUpperCase() === 'SUCCESS') {
        setTasks([...tasks, response.data]);
        setCreateTask(false); // Close the add task modal
      } else {
        setError('Failed to add task. Please try again.');
      }
    } catch (error) {
      setError('Failed to add task. Please try again later.');
      console.error('Add task error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-board">
        <div className="task-board-header">
          <button className="add-task-btn" onClick={() => setCreateTask(true)}>
            Add Task
          </button>
        </div>

        <SearchAndSort
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading && <Loader />}
        {error && <p className="error-message">{error}</p>}

        <div className="task-columns">
          <TaskColumn
            refreshTasks={fetchTasks}
            title="TODO"
            status="TODO"
            tasks={tasks.filter(task => task.status === 'TODO')}
            moveTask={moveTask}
          />
          <TaskColumn
            refreshTasks={fetchTasks}
            title="IN PROGRESS"
            status="IN_PROGRESS"
            tasks={tasks.filter(task => task.status === 'IN_PROGRESS')}
            moveTask={moveTask}
          />
          <TaskColumn
            refreshTasks={fetchTasks}
            title="DONE"
            status="DONE"
            tasks={tasks.filter(task => task.status === 'DONE')}
            moveTask={moveTask}
          />
        </div>
        {createTask && (
          <TaskModal
            isEditable={true}
            onClose={() => setCreateTask(false)}
            onSave={(title, description) => handleAddTask(title, description)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
