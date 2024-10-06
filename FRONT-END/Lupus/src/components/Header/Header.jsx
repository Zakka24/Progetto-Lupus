import React, { useContext, useEffect } from 'react';
import { WebSocketContext } from '../WebSocket/WebSocketProvider';  // Importa il contesto WebSocket
import { useNavigate } from 'react-router-dom';  // Importa useNavigate per il reindirizzamento
import logo from './logo_lupus.jpeg';
import styles from './Header.module.css';

function Header() {
  const { socket, user, setUser } = useContext(WebSocketContext);  // Ottieni socket e user dal contesto
  const navigate = useNavigate();  // Usa useNavigate per il reindirizzamento

  useEffect(() => {
    if (socket) {
      // Ascolta gli eventi WebSocket per login/logout
      socket.on('user-logged-in', (data) => {
        console.log(`${data.username} ha effettuato il login.`);
      });

      socket.on('user-logged-out', (data) => {
        console.log(`${data.username} ha effettuato il logout.`);
      });

      socket.on('new-session-available', (data) => {
        console.log('Nuova sessione disponibile: ', data);
      });
    }
  }, [socket]);

  const handleSignInClick = () => {
    navigate('/login');  // Reindirizza alla pagina di login
  };

  const handleLogout = () => {
    // Invia evento di logout tramite WebSocket
    socket.emit('user-logged-out', { username: user });
    setUser(null);  // Rimuovi l'utente loggato dallo stato
    navigate('/');  // Reindirizza alla homepage dopo il logout
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo Lupus" className={styles.logo}/>
      </div>
      <nav className={styles.navLinks}>
        <a href="/" className={styles.navLink}>Homepage</a>
        <a href="/sessions" className={styles.navLink}>Sessioni</a>
        <a href="/roles" className={styles.navLink}>Vedi i ruoli</a>
      </nav>

      {user ? (
        <div className={styles.userSection}>
          <span className={styles.username}>{user}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className={styles.signInButton} onClick={handleSignInClick}>
          Sign-in
        </button>
      )}
    </header>
  );
}

export default Header;
