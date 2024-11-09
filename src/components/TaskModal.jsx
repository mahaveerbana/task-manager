import React, { useState, useEffect } from 'react';
import '../styles/TaskModal.css'; // Assuming CSS for modal

const TaskModal = ({ isEditable, onClose, onSave, task = {} }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  // Update title and description when the task prop changes
  useEffect(() => {
    if (task?.title || task?.description) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
    }
  }, [task]);

  const handleSave = () => {
    onSave(title, description);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task.id ? (isEditable ? 'Edit Task' : 'Task Details') : 'Create Task'}</h2>
        <div className="modal-body">
          <div>
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              disabled={!isEditable}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              disabled={!isEditable}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} aria-label="Close Modal">Close</button>
          {isEditable && <button onClick={handleSave}>Save</button>}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
