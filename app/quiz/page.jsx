// pages/quiz/page.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import styles from './page.css'; // Adjust the path based on your project structure

function generateRandomUUID() {
  return uuidv4();
}

const ProjectForm = () => {
  const initialFormData = {
    id: '',
    name: '',
    'start-date': '',
    'end-date': '',
    details: '',
    libraries: '',
    size: '',
    experience: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();

  const navigateToDashboard = (uuid) => {
    router.push(`/dashboard/${uuid}`);
  };

  // Function to load saved form data from cookie
  useEffect(() => {
    const savedFormData = getCookie('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const questions = [
    {
      name: 'name',
      question: 'What is your project name?',
    },
    {
      name: 'start-date',
      question: 'What is the start date of your project?',
    },
    {
      name: 'end-date',
      question: 'What is the end date of your project?',
    },
    {
      name: 'details',
      question: 'Describe your project’s features in detail.',
    },
    {
      name: 'libraries',
      question: 'List any frameworks/libraries that you would like to use in your project.',
    },
    {
      name: 'size',
      question: 'What is the size of your team? (e.g. 1 person)',
    },
    {
      name: 'experience',
      question: 'What is your team’s experience level? (i.e. low-experience, medium-experience, or high-experience)',
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Generate a random UUID
    const uuid = generateRandomUUID();
    // Update formData with the generated UUID
    const updatedFormData = { ...formData, id: uuid };
    // Save updated form data to cookie that expires in 30 days
    setCookie('formData', JSON.stringify(updatedFormData), 30);
    // Update state with the updated formData
    setFormData(updatedFormData);
    navigateToDashboard(uuid);
    console.log(updatedFormData);
  };

  // Function to get a cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Function to set a cookie with expiration in days
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>Project Information</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.name} className={styles.formGroup}>
            <label className={styles.formLabel}>{question.question}</label>
            <br />
            {question.name === 'start-date' || question.name === 'end-date' ? (
              <input
                type="date"
                name={question.name}
                value={formData[question.name]}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            ) : question.name === 'details' ? (
              <textarea
                name={question.name}
                value={formData[question.name]}
                onChange={handleChange}
                className={styles.formTextarea}
                required
              />
            ) : (
              <input
                type="text"
                name={question.name}
                value={formData[question.name]}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            )}
            <br /><br />
          </div>
        ))}
        <button type="submit" className={styles.formButton}>Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;
