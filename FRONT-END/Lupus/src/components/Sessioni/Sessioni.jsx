import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate per il reindirizzamento
import styles from './Sessioni.module.css';
import Header from '../Header/Header';
import { WebSocketContext } from '../WebSocket/WebSocketProvider'; // Importa il contesto WebSocket

function Sessioni({ menuOpen, setMenuOpen }) {
  const { socket, setSocket } = useContext(WebSocketContext);
  const [sessions, setSessions] = useState([]);
  const [loadingSessioni, setloadingSessioni] = useState(true);
  const [errorSessioni, setErrorSessioni] = useState(null);
  const [loadingEntra, setloadingEntra] = useState();
  const [errorEntra, setErrorEntra] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sessions');
        const data = await response.json();

        if (response.ok) {
          setSessions(data.sessioni);
        } else {
          throw new ErrorSessioni(data.message || 'Failed to fetch sessions');
        }
      } catch (errorSessioni) {
        setErrorSessioni(errorSessioni.message);
      } finally {
        setloadingSessioni(false);
      }
    };

    fetchSessions();
  }, []);


  if (loadingSessioni) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.loadingSessioni}>loadingSessioni...</div>
      </>
    );
  }

  if (errorSessioni) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.errorSessioni}>ErrorSessioni: {errorSessioni}</div>
      </>
    );
  }

  if (sessions.length === 0) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.noSessions}>No sessions found.</div>
      </>
    );
  }

  const handleEntraSessione = async(sessionID) => {
    try {
      setloadingEntra(true);
  
      const response = await fetch('http://localhost:8080/api/sessions/entra-sessione/' + sessionStorage.getItem('userID') + '/' + sessionID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        socket.emit('entra-sessione', {
          username: sessionStorage.getItem('username'),
          sessionID: sessionID  
        });
        
        // Reindirizza alla pagina di attesa
        navigate(`/attesa-sessione/${sessionID}`, {
          state:{ sessionID }
        })
      } else {
        throw new Error(data.message || "Entrata fallita");
      }
    } catch (error) {
      setErrorEntra(error.message);
    } finally {
      setloadingEntra(false);
    }
  };
  

  if (loadingEntra) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.loadingEntra}>loadingEntra...</div>
      </>
    );
  }

  if (errorEntra) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.errorEntra}>ErrorEntra: {errorEntra}</div>
      </>
    );
  }

  const handleCreaSessioneButton = async() => {
    navigate('/crea-sessione')
  }


  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {sessionStorage.getItem('token') ? (
      <button className={styles.createSessionButton} onClick={handleCreaSessioneButton}>
        Crea una nuova sessione
      </button>
      ) : (
        null
      )}
      <div className={styles.sessionsContainer}>
        <h1>Active Sessions</h1>
        <ul className={styles.sessionsList}>
          {sessions.map((session) => (
            <li key={session.id} className={styles.sessionItem}>
              <p>
                <strong>Session ID:</strong> {session.id}
              </p>
              <p>
                <strong>Admin ID:</strong> {session.admin_id}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(session.data_creazione).toLocaleString()}
              </p>
              {sessionStorage.getItem('token') ? (
                <button onClick={() => handleEntraSessione(session.id)}>
                  Unisciti alla sessione
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

    </>
  );
}

export default Sessioni;