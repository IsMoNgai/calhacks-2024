'use client'

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';

function generateRandomUUID() {
  return uuidv4();
}

export default function Home() {

  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [formData, setFormData] = useState({});

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
    setSelectedRepo('');
    if (event.target.value.length > 0) {
      debouncedGetUserRepos(event.target.value);
    } else {
      setRepos([]);
      setShowDropdown(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setShowDropdown(false);
  };

  const handleClick = (repo) => {
    const uuid = generateRandomUUID();
    // Update formData with the generated UUID
    const updatedFormData = { repo: repo, id: uuid };
    setFormData(updatedFormData);
    setCookie('formData', JSON.stringify(updatedFormData), 30);
  }

  const getUserRepos = async (username) => {
    const url = `https://api.github.com/users/${username}/repos`;

    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        setRepos(data);
        setShowDropdown(true);
      } else {
        setRepos([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error(`Error fetching repositories: ${error.message}`);
      setRepos([]);
      setShowDropdown(false);
    }
  };

  const debouncedGetUserRepos = useCallback(debounce(getUserRepos, 300), []);

  return (
    <main>
      <div className="container">
        <h1>Project Name</h1>
        <h2>Try It</h2>
        <input
          placeholder="Enter GitHub username"
          value={username}
          onChange={handleChange}
          required
        />
        {showDropdown && repos.length > 0 && (
          <ul className="dropdown">
            {repos.map((repo) => (
              <li key={repo.id} onClick={() => handleRepoSelect(repo.name)}>
                {repo.name}
              </li>
            ))}
          </ul>
        )}
        {selectedRepo && (
          <div className="selected-repo">
            <h3>Selected Repository: {selectedRepo}</h3>
            <Link href="/quiz/1">
              <button onClick={() => handleClick(`https://api.github.com/repos/${username}/${selectedRepo}`)}>Get Started</button>
            </Link> 
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 50px;
        }
        .dropdown {
          list-style-type: none;
          padding: 0;
          margin: 0;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 10px;
        }
        .dropdown li {
          padding: 10px;
          cursor: pointer;
        }
        .dropdown li:hover {
          background-color: #f0f0f0;
        }
        .selected-repo {
          margin-top: 20px;
        }
        button {
          margin-top: 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
