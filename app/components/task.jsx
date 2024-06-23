import React from 'react';

const Task = ({ time, title, description }) => {
  const taskStyle = {
    'background': 'rgba(168, 67, 220, 0.04)',
    'border-radius': '16px',
    'box-shadow': '0 4px 30px rgba(0, 0, 0, 0.1)',
    'backdrop-filter': 'blur(11.6px)',
    '-webkit-backdrop-filter': 'blur(11.6px)',
    'border': '1px solid rgba(168, 67, 220, 0.71)'
  };

  return (
    <li>
      <div style={taskStyle}>
        <time>{time}</time>
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </li>
  );
};

export default Task;
