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
    <main className="flex items-center justify-center border-none">
      {/* Replace video background with image */}
      <div className="image-container">
        <div className="fullscreen-image" />
        <div className="content-container">
          <div className="container md:mt-32 border-none flex flex-col items-center justify-center h-full mx-auto opacity-80">
            {/* Remove h1 and h5 headers */}
            <div className="github-form">
            <input
              className="text-md rounded-full px-8 border-none py-4 mt-4"
              placeholder="Enter GitHub Username"
              value={username}
              onChange={handleChange}
              required
            />
            </div>
            {showDropdown && repos.length > 0 && (
              <ul className="dropdown max-h-40 border-none overflow-y-auto">
                {repos.map((repo) => (
                  <li
                    key={repo.id}
                    onClick={() => handleRepoSelect(repo.name)}
                    className="cursor-pointer py-2 px-4 border-none hover:bg-[#b6b1fb] rounded "

                  >
                    {repo.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedRepo && (
              <div className="selected-repo text-white mt-48">
                <h3>Selected Repository: {selectedRepo}</h3>
                <Link href="/quiz/1">
                  <button
                    className="bg-purple-400 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleClick(`https://api.github.com/repos/${username}/${selectedRepo}`)}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .Home {
            overflow: hidden;
        }
        .image-container {
          background-image: url('/hero-page.svg'); 
          background-size: cover;
          width: 100vw;
          height: 100vh;
          margin:0;
          padding:0;

       
          overflow: hidden;
        }

      .github-form {
          
      }

        .fullscreen-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          
        }

        .content-container {
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          
        }
        .container {
          max-width: 600px;
          text-align: center;
          padding: 50px;
          margin-top: 5%;
          
        
          
        }
        .dropdown {
          list-style-type: none;
          padding: 0;
          margin: 0;
          background: rgba(255, 255, 255, 0.2);
          border-bottom-right-radius: 16px;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8.7px);
          -webkit-backdrop-filter: blur(8.7px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          
        }
        .dropdown li {
          cursor: pointer;
          
        }
        .dropdown li:hover {
          
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