'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Load the endDate from cookie if it exists
    const cookieEndDate = getCookie('formData');
    if (cookieEndDate) {
      const formData = JSON.parse(cookieEndDate);
      setEndDate(formData.endDate || '');
    }
  }, []);

  const handleChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCookieWithEndDate(endDate);
    router.push('/quiz/2'); // Redirect to the next page after submitting the date
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const updateCookieWithEndDate = (endDate) => {
    const cookieName = 'formData';
    const cookieValue = getCookie(cookieName) || '{}';
    const formData = JSON.parse(cookieValue);
    formData.endDate = endDate;
    setCookie(cookieName, JSON.stringify(formData), 30); // Update cookie with formData
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
        <h2 className="max-w-300px">When is the expected end date of your project?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={endDate}
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
          justifyContent: center;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
          padding: 50px;
        }
        input {
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
