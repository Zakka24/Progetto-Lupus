import React, { useContext } from 'react';
import { WebSocketContext } from '../WebSocket/WebSocketProvider';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ menuOpen, setMenuOpen }) {  // Riceve menuOpen e setMenuOpen come props
  const { socket } = useContext(WebSocketContext);
  const navigate = useNavigate();

  // console.log(sessionStorage.getItem('token'))
  // console.log(sessionStorage.getItem('userID'))

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      let token = sessionStorage.getItem('token');
      const username = sessionStorage.getItem('username');
      const response = await fetch('http://localhost:8080/api/auth/logout/' + username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const username = sessionStorage.getItem('username');
        sessionStorage.clear();

        if (socket) {
          socket.emit('user-logged-out', username);
        }

        // Reindirizza alla homepage
        navigate('/');
      } else {
        throw new Error(data.message || 'Logout fallito');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // Usa setMenuOpen per aprire/chiudere il menu
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="logo_lupus.jpeg" alt="Logo Lupus" className={styles.logo} />
      </div>
      <button className={styles.hamburger} onClick={toggleMenu}>
        &#9776; {/* Icona hamburger */}
      </button>

      <nav className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
        <Link to="/" className={styles.navLink}>Homepage</Link>
        <Link to="/sessions" className={styles.navLink}>Sessioni</Link>
        <Link to="/roles" className={styles.navLink}>Vedi i ruoli</Link>
        <div className={styles.userSection}>
          {sessionStorage.getItem('username') ? (
            <>
              <span className={styles.username}>{sessionStorage.getItem('username')}</span>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className={styles.signInButton} onClick={handleSignInClick}>
              Sign-in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
