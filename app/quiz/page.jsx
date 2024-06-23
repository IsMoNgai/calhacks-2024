'use client';
import React, { useState, useRef } from 'react';
import { quiz } from '../data.js';
import { collection, addDoc } from "firebase/firestore";
import {db} from '../firebase.js'

const Page = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userResponses, setUserResponses] = useState({});
  const inputRef = useRef(null);

  const { questions } = quiz;

  const nextQuestion = () => {
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
      sendQuizData(); // Call sendQuizData only when showing results
    }
  };

  const getInputs = (value, name) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = inputRef.current;
    getInputs(input.value, input.name);
    input.value = ''; // Clear the input field after submission
    nextQuestion();
  };

  const sendQuizData = async () => {
    try {
      const docRef = await addDoc(collection(db, "userInput"), userResponses);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error('Error saving quiz data:', error);
    }
  };  

  return (
    <div className='container'>
      <h1>Quiz Page</h1>
      <div>
        <h2>
          Question: {activeQuestion + 1}
          <span>/{questions.length}</span>
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className='quiz-container'>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                placeholder={questions[activeQuestion].question}
                name={String(questions[activeQuestion].name)}
              />
              <button type="submit" style={{ display: 'none' }} />
            </form>
          </div>
        ) : (
          <div className='quiz-container'>
            <h3>Results</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
