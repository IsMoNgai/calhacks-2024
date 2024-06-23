'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Frameworks() {
  const [frameworks, setFrameworks] = useState([]);
  const [frameworkInput, setFrameworkInput] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const router = useRouter();

  useEffect(() => {
    // Load selected frameworks from cookie if they exist
    const cookieFrameworks = getCookie('formData');
    if (cookieFrameworks) {
      const formData = JSON.parse(cookieFrameworks);
      setSelectedFrameworks(formData.frameworks || []);
    }
  }, []);

  const handleInputChange = (event) => {
    const inputText = event.target.value;
    setFrameworkInput(inputText);
    // Simulate search functionality for close frameworks
    searchFrameworks(inputText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && frameworkInput.trim() !== '') {
      event.preventDefault(); // Prevent form submission on Enter key
      addFramework(frameworkInput.trim().toLowerCase()); // Convert to lowercase
      setFrameworkInput('');
    }
  };

  const handleFrameworkSelect = (framework) => {
    addFramework(framework.toLowerCase()); // Convert to lowercase
    setFrameworkInput('');
    setShowDropdown(false); // Hide dropdown after selecting framework
  };

  const addFramework = (framework) => {
    const lowercaseFrameworks = selectedFrameworks.map(f => f.toLowerCase());
    if (!lowercaseFrameworks.includes(framework)) {
      setSelectedFrameworks([...selectedFrameworks, framework]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCookieWithFrameworks(selectedFrameworks);
    const formData = JSON.parse(getCookie('formData'));
    const id = formData.id; // Get ID from cookie
    router.push(`/dashboard/${id}`); // Redirect to the dashboard with the ID
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const updateCookieWithFrameworks = (frameworks) => {
    const cookieName = 'formData';
    const cookieValue = getCookie(cookieName) || '{}';
    const formData = JSON.parse(cookieValue);
    formData.frameworks = frameworks;
    setCookie(cookieName, JSON.stringify(formData), 30); // Update cookie with formData
  };

  const searchFrameworks = (query) => {
    // Simulated function to search for close frameworks
    if (query.trim() === '') {
      setFrameworks([]);
      setShowDropdown(false); // Hide dropdown when input is empty
    } else {
      // Example of close frameworks
      const closeFrameworks = ['React', 'Angular', 'Vue.js', 'Express', 'Django'];
      const filteredFrameworks = closeFrameworks.filter(framework =>
        framework.toLowerCase().includes(query.toLowerCase())
      );
      setFrameworks(filteredFrameworks.slice(0, 5)); // Limit to 5 results
      setShowDropdown(true); // Show dropdown when there are search results
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

  const removeFramework = (framework) => {
    const updatedFrameworks = selectedFrameworks.filter(item => item !== framework);
    setSelectedFrameworks(updatedFrameworks);
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-[#282828] text-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-3xl pb-2">Project Quiz</h1>
        <h2 className="text-md pb-2">Add Frameworks</h2>
        <form onSubmit={handleSubmit}>
          <div className="frameworks-input">
            {selectedFrameworks.map((framework, index) => (
              <div className="framework-label" key={index}>
                {framework}
                <span className="remove-btn" onClick={() => removeFramework(framework)}>x</span>
              </div>
            ))}
            <input
            className="rounded-lg text-black"
              type="text"
              value={frameworkInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add Frameworks"
            />

            {showDropdown && frameworks.length > 0 && (
              <ul className="dropdown">
                {frameworks.map((framework, index) => (
                  <li className="text-black border-none" key={index} onClick={() => handleFrameworkSelect(framework)}>
                    {framework}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-center">
          <button type="button" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200" onClick={handleBack}>Back</button>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200">Submit</button>
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
        .frameworks-input {
          margin-bottom: 20px;
          position: relative;
        }
        .framework-label {
          display: inline-block;
          background-color: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
          padding: 5px 10px;
          margin: 5px;
          border-radius: 4px;
        }
        .remove-btn {
          cursor: pointer;
          margin-left: 5px;
        }
        input {
          margin-top: 10px;
          padding: 10px;
          font-size: 16px;
          width: calc(100% - 50px);
        }
        .dropdown {
          list-style-type: none;
          padding: 0;
          margin: 0;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
          position: absolute;
          top: 35px;
          left: 0;
          width: 100%;
          background-color: #fff;
          z-index: 1000;
        }
        .dropdown li {
          padding: 10px;
          cursor: pointer;
          color: black;
        }
        .dropdown li:hover {
          background-color: #f0f0f0;
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
