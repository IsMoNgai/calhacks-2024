'use client';

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
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-[#282828] text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg mb-4">When is the expected end date of your project?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={endDate}
            onChange={handleChange}
            className="bg-gray-200 text-black p-2 rounded-md mb-4"
            required
          />
          <div className="flex justify-between">
            <button type="button" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200" onClick={handleBack}>Back</button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
}
