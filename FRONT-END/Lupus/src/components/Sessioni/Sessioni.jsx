// File: Sessions.js
import React, { useEffect, useState } from 'react';
import styles from './Sessioni.module.css'
import Header from '../Header/Header';

function Sessioni(){
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching session data from the API
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sessions');
        const data = await response.json();

        if (response.ok) {
          setSessions(data.sessioni);
        } else {
          throw new Error(data.message || 'Failed to fetch sessions');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return(
        <>
            <Header/>
            <div className={styles.loading}>Loading...</div>
        </>
    );
  }

  if (error) {
    return(
        <>
            <Header/>
            <div className={styles.error}>Error: {error}</div>
        </>
    );
  }

  if (sessions.length === 0) {
    return(
        <>
            <Header/>
            <div className={styles.noSessions}>No sessions found.</div>
        </>
    );
  }

  return (
    <>
        <Header/>
        <div className={styles.sessionsContainer}>
        <h1>Active Sessions</h1>
        <ul className={styles.sessionsList}>
            {sessions.map((session) => (
            <li key={session.id} className={styles.sessionItem}>
                <p><strong>Session ID:</strong> {session.id}</p>
                <p><strong>Admin ID:</strong> {session.admin_id}</p>
                <p><strong>Created At:</strong> {new Date(session.data_creazione).toLocaleString()}</p>
            </li>
            ))}
        </ul>
        </div>
    </>
  );
};

export default Sessioni;
