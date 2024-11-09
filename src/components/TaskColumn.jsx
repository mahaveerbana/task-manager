import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, status, tasks, moveTask, refreshTasks }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      moveTask(item.id, item.column, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`task-column ${isOver ? 'over' : ''}`}>
      <div className="task-column-header">
        {title}
      </div>
      <div className="task-list">
        {tasks
          .filter(task => task.status === status)
          .map(task => (
            <TaskCard key={task.id} task={task} status={status} refreshTasks={refreshTasks} />
          ))}
      </div>
    </div>
  );
};

export default TaskColumn;
