import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { WebSocketContext } from '../WebSocket/WebSocketProvider';
import styles from './WaitPage.module.css';
import Header from '../Header/Header';
import Card from './Card';

function WaitPage({ menuOpen, setMenuOpen }) {
  const { socket } = useContext(WebSocketContext);
  const [userCount, setUserCount] = useState(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [rolesAssigned, setRolesAssigned] = useState([]); // Stato per i ruoli assegnati
  const [myRole, setMyRole] = useState(null); // Stato per il ruolo dell'utente (ora è un singolo oggetto)
  const [error, setError] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false); // Stato per tracciare l'inizio della sessione
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoles = location.state?.selectedRoles || [];
  const sessionID = location.state.sessionID;

  useEffect(() => {
    // Ascolta l'evento per aggiornare il conteggio degli utenti
    socket.on('update-user-count', (data) => {
      if (data.sessionID === sessionID) {
        setUserCount(data.userCount);
        setMaxUsers(data.maxUsers);
      }
    });

    // Ascolta l'evento per l'inizio della sessione
    socket.on('session-started', (data) => {
      if (data.sessionID === sessionID) {
        console.log(`Sessione ${sessionID} avviata`);
        setSessionStarted(true);
        if (location.state.isAdmin === 'true') {
          socket.on('assegnazioni-admin', async (data) => {
            console.log(data);

            const rolesWithDetails = []; // Array per memorizzare i dettagli dei ruoli

            for (const [username, roleId] of Object.entries(data)) {
              try {
                const response = await fetch('http://localhost:8080/api/roles/' + roleId);
                const roleData = await response.json();

                if (response.ok) {
                  // Aggiungi i dettagli del ruolo associato all'utente
                  rolesWithDetails.push({
                    id: roleData.ruolo[0].id, // ID del ruolo
                    nome: roleData.ruolo[0].nome, // Nome del ruolo
                    parte: roleData.ruolo[0].parte, // Parte del ruolo
                    descrizione: roleData.ruolo[0].descrizione, // Descrizione del ruolo
                    username: username // Aggiungi l'username
                  });
                } else {
                  throw new Error('Errore nel recuperare i dettagli del ruolo');
                }
              } catch (error) {
                setError(error.message);
                console.error('Errore nel recuperare i dettagli del ruolo:', error);
              }
            }

            // Salva i ruoli assegnati con i dettagli nel state
            setRolesAssigned(rolesWithDetails);
          });
        } else {
          // Se non è l'admin, ricevi solo il tuo ruolo
          socket.on('ruolo-assegnato', async (data) => {
            try {
              if (data.username === sessionStorage.getItem('username')) {
                setMyRole(data.ruolo); // Imposta il ruolo dell'utente
                const response = await fetch('http://localhost:8080/api/roles/' + data.ruolo);
                const roleData = await response.json();
                if (response.ok) {
                  setMyRole(roleData.ruolo[0]); // Imposta i dettagli del ruolo
                } else {
                  throw new Error(data.message || "Errore nel recuperare il ruolo");
                }
              }
            } catch (error) {
              setError(error.message);
            }
          });
        }
      }
    });

    // Pulizia alla disconnessione
    return () => {
      socket.off('update-user-count');
      socket.off('session-started');
      socket.off('assegnazioni-admin');
      socket.off('ruolo-assegnato');
    };
  }, [socket, sessionID, location.state.isAdmin]);

  const handleStartSession = () => {
    const sessionData = {
      sessionID,
      username: sessionStorage.getItem('username'), // Invia il nome dell'admin
      selectedRoles: selectedRoles, // Invia i ruoli selezionati
    };

    socket.emit('start-session', sessionData);
  };

  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {location.state.isAdmin === 'true' ? (
        <div className={styles.waitPage}>
          <h1>Attesa degli utenti</h1>
          <p>Utenti in sessione: {userCount}/{maxUsers || selectedRoles.length}</p>
          <div className={styles.loadingAnimation}>
            <div className={styles.loader}></div>
            <p>In attesa che tutti gli utenti entrino...</p>
          </div>
          <button onClick={handleStartSession} className={styles.startButton}>
            Avvia sessione
          </button>
          {/* Mostra i ruoli assegnati usando la componente Card */}
          {rolesAssigned.length > 0 && (
            <Card items={rolesAssigned.map(role => ({
              id: role.id,
              immagine: role.nome,
              nome: `${role.username} - ${role.nome}`, // Mostra username e nome del ruolo
              parte: role.parte,
              descrizione: role.descrizione
            }))} />
          )}
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Attendi, la partita sta per iniziare...</p>
          <div className={styles.dots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {/* Mostra il ruolo dell'utente non admin solo se la sessione è iniziata */}
          {sessionStarted && myRole && (
            <div className={styles.myRoleContainer}>
              <h2>Il tuo ruolo:</h2>
              <Card items={[{
                id: myRole.id,
                immagine: myRole.nome,
                nome: myRole.nome,
                parte: myRole.parte,
                descrizione: myRole.descrizione
              }]} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default WaitPage;