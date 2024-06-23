'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Task from '../../components/task.jsx';
import styles from "../../styles/Dashboard.roadmap.css";

const Page = () => {
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
    <div>
      <div className="timeline-wrapper">
        <section className="timeline">
          <div className="info">
          <button className="back-button" onClick={() => router.back()}>&larr;</button>
            <img width="50" height="50" src="https://assets.codepen.io/210284/face.svg" alt="" />
            <h2>Task Timeline</h2>
            <p>You can see the entire timeline for the tasks you need to complete, along with their due dates and detailed descriptions.</p>
          </div>
          <ol>
            {tasks.map(task => (
              <Task
                key={task.id}
                time={task.time}
                title={task.title}
                description={task.description}
              />
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default Page;
