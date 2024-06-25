'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Dashboard.module.css";
import HumeStream from "@/app/components/HumeStream";
import { useHumeStream } from '@/app/components/HumeStream';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function Dashboard() {
  const router = useRouter();
  const { Concentration, Boredom, Anxiety, Tiredness } = useHumeStream();
  const [formData, setFormData] = useState({});
  const [repoData, setRepoData] = useState(null)
  const [user, setUser] = useState()
  const [repo, setRepo] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the cookie value
        const cookieFormData = getCookie("formData");
        const formData = JSON.parse(cookieFormData);

        // Create FormData with the repository URL
        const form = new FormData();
        form.append("repository", formData.repo);

        let parts = formData.repo.split('/');
        setUser(parts[4]);
        setRepo(parts[5]);

        // Fetch data from the API
        const response = await fetch("http://127.0.0.1:5001/fetch_repos", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response as JSON
        const data = await response.json();
        console.log("Data:", data);

        if (typeof data.response === 'string') {
          data.response = data.response.substring(0,300); // Limit to 50 characters
        }

        // Set the fetched data to state
        setRepoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call fetchData when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    const cookieFormData = getCookie('formData');
    if (cookieFormData) {
      setFormData(JSON.parse(cookieFormData));
    } else {
      router.push('/'); // Redirect to home if no cookie found
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'formData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Repository: {repo}</h2>
        <h2 className={styles.subtitle}>Welcome, {user || 'Name'}</h2>
        <div className={styles.grid}>

          <div className={`${styles.gridItem} ${styles.documentation}`}>
            <h3>Documentation</h3>
            <p>{repoData?.response}...</p>
          </div>

          <div className={`${styles.gridItem} ${styles.progress}`}>
            <img src="/task-chart.svg" alt="Task Chart" />
          </div>

          <div className={`${styles.gridItem} ${styles.Roadmaps}`}>
            <h3>Roadmap</h3>
            <img src="/map-ui.svg" alt="Map UI" />
          </div>  

          <div className={styles.gridRight}>
            <div className={`${styles.gridItem} ${styles.concentration}`}>
              <h3>Concentration Level</h3>
              <div className={`${styles.chart} rounded-lg bg-transparent`}>
                <HumeStream />
              </div>
            </div>

            <div className={`${styles.gridItem} ${styles.voiceAi}`}>
              <h3>Voice AI Metrics</h3>
              <div className={styles.voiceMetrics}>
                <span>Concentration: {Concentration}</span>
                <span>Boredom: {Boredom}</span>
                <span>Anxiety: {Anxiety}</span>
                <span>Tiredness: {Tiredness}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
