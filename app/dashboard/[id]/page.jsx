// Page.js
'use client'
import React, { useState, useEffect } from "react";

const Page = ({ params }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data based on the uuid stored in the cookie
    const uuid = params.id;
    const savedFormData = getCookie('formData');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      // Check if formData is an array before filtering
      if (Array.isArray(formData)) {
        const filteredData = formData.filter(item => item.id === uuid);
        setData(filteredData);
      } else if (typeof formData === 'object') {
        // If formData is a single object, wrap it in an array
        const filteredData = formData.id === uuid ? [formData] : [];
        setData(filteredData);
      } else {
        console.error('formData is not an array or object:', formData);
        setData([]);
      }
    } else {
      setData([]);
    }
  }, [params.id]);

  // Function to get a cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div>
      <h1>User Input Data</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
