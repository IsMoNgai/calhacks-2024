'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Dashboard.module.css";

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
    <main>
      <div className={styles.container}>
        <h1>Welcome to Dashboard</h1>
        <div className={styles.grid}>
          <div className={`${styles.gridItem} ${styles.item1}`}>Item 1</div>
          <div className={styles.gridItem}>Item 2</div>
          <div className={styles.gridItem}>Item 3</div>
          <div className={styles.gridItem}>Item 4</div>
          <div className={styles.gridItem}>Item 5</div>
          <div className={styles.gridItem}>Item 6</div>
          <div className={styles.gridItem}>Item 7</div>
          <div className={styles.gridItem}>Item 8</div>
          <div className={styles.gridItem}>Item 9</div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </main>
  );
}
