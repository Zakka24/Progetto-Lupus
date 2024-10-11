import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Card from './Card';
import styles from './Ruoli.module.css';

function Ruoli({ menuOpen, setMenuOpen }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRuoli = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/api/roles/');
        const data = await response.json();

        if (response.ok) {
          setRoles(data.roles);
        } else {
          throw new Error(data.message || 'Errore nel recuperare i ruoli');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRuoli();
  }, []);

  if (loading) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.loading}>Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.error}>Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={styles.rolesContainer}>
        <h1 className={styles.title}>Lista dei Ruoli</h1>
        <Card items={roles} category="Ruoli Disponibili" />
      </div>
    </>
  );
}

export default Ruoli;