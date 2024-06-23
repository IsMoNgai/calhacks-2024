'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Dashboard.module.css";
import Roadmap from '../../components/roadmap'

export default function Dashboard() {
  const [id, setId] = useState('');
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const cookieFormData = getCookie('formData');
    if (cookieFormData) {
      const parsedFormData = JSON.parse(cookieFormData);
      setFormData(parsedFormData);
      setId(parsedFormData.id);
    } else {
      router.push('/'); // Redirect to home if no cookie found
    }
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLogout = () => {
    document.cookie = 'formData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Delete cookie
    router.push('/'); // Redirect to home after logout
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Repository Name</h1>
        <h2 className={styles.subtitle}>Welcome Name</h2>
        <div className={styles.grid}>



          
          <div className={`${styles.gridItem} ${styles.documentation}`}>
            <h3>Documentation</h3>
            <p>Description of this tool</p>
          </div>
          <div className={`${styles.gridItem} ${styles.progress}`}>
            <div className={styles.circle}>
              <span>9/23</span>
            </div>
            <div className={styles.labels}>
              <span className={styles.easy}>Easy</span>
              <span className={styles.medium}>Medium</span>
              <span className={styles.hard}>Hard</span>
            </div>
            <p className={styles.timer}>40 days 54 hours 20 minutes left</p>
          </div>
          <div className={`${styles.gridItem} ${styles.roadmap}`}>
            <h3>Roadmap</h3>
            <div className={styles.timeline}></div>
            <Roadmap></Roadmap>
          </div>
        

        
         
          <div className={styles.gridRight}>
          <div className={`${styles.gridItem} ${styles.concentration}`}>
            <h3>Concentration Level</h3>
            <div className={styles.chart}></div>
          </div>
          <div className={`${styles.gridItem} ${styles.voiceAi}`}>
            <h3>Voice AI</h3>
            <div className={styles.voiceMetrics}>
              <div className={styles.metric}>
                <span>Concentration</span>
                <span className={styles.dotYellow}></span>
              </div>
              <div className={styles.metric}>
                <span>Boredom</span>
                <span className={styles.dotBlue}></span>
              </div>
              <div className={styles.notification}>
                <span>Notification</span>
              </div>
            </div>
            </div>
          </div>
        </div>
        
      </div>
      
    </main>
  );
}


