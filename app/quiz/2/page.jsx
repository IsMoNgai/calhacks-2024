'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Details() {
  const [details, setDetails] = useState('');
  const router = useRouter();

  const handleChange = (event) => {
    setDetails(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCookieWithDetails(details);
    router.push('/quiz/3'); // Redirect to the next page after submitting details
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const updateCookieWithDetails = (details) => {
    const cookieName = 'formData';
    const cookieValue = getCookie(cookieName);
    if (cookieValue) {
      const formData = JSON.parse(cookieValue);
      formData.details = details;
      setCookie(cookieName, JSON.stringify(formData), 30);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  return (
    <main>
      <div className="container">
        <h1>Project Quiz</h1>
        <h2>Please provide details about your project:</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="10"
            cols="50"
            value={details}
            onChange={handleChange}
            required
          />
          <div className="buttons">
            <button type="button" onClick={handleBack}>Back</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 50px;
        }
        textarea {
          margin-top: 20px;
          padding: 10px;
          font-size: 16px;
        }
        .buttons {
          margin-top: 20px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
