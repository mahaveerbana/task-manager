import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { put, remove } from '../services/sendRequest';
import TaskModal from './TaskModal';

const TaskCard = ({ task, status, refreshTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, column: status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const openModal = (editMode = false) => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(editMode);
    setShowModal(true);
  };

  const saveChanges = async (title, description) => {
    const updatedTask = { ...task, title, description };
    try {
      await put(`/tasks/${task.id}`, updatedTask);
      setShowModal(false);
      refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async () => {
    try {
      await remove(`/tasks/${task.id}`);
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <div ref={drag} className={`task-card ${isDragging ? 'dragging' : ''}`}>
        <span className="task-title">{task.title}</span>
        <span className="task-description">{task.description}</span>
        <p className="task-created">
          Created at: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}
        </p>
        <div className="task-actions">
          <button onClick={deleteTask} className="delete-btn">Delete</button>
          <button onClick={() => openModal(true)} className="edit-btn">Edit</button>
          <button onClick={() => openModal(false)} className="view-details-btn">View Details</button>
        </div>
      </div>

      {showModal && (
        <TaskModal
          isEditable={isEditing}
          onClose={() => setShowModal(false)}
          onSave={saveChanges}
          task={{ title: editedTitle, description: editedDescription }}
        />
      )}
    </>
  );
};

export default TaskCard;
