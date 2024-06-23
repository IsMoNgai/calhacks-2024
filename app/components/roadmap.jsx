// pages/roadmap.js

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation.js';
import Task from './task.jsx'; // Import the Task component

const Roadmap = () => {
  const router = useRouter();

  useEffect(() => {
    const elH = document.querySelectorAll(".timeline li > div");
    setEqualHeights(elH);
  }, []);

  const setEqualHeights = (el) => {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = el[i].offsetHeight;
      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  };

  const tasks = [
    { id: 1, time: '1934', title: 'Title 1', description: 'Description 1' },
    { id: 2, time: '1937', title: 'Title 2', description: 'Description 2' },
    { id: 3, time: '1940', title: 'Title 3', description: 'Description 3' },
  ];

  return (
<div className='roadmapping'>
  {tasks.map(task => (
    <Task
      key={task.id}
      time={task.time}
      title={task.title}
      description={task.description}
    />
  ))}
</div>
  );
};

export default Roadmap;
