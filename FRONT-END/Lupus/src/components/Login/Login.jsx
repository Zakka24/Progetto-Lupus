import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate per il reindirizzamento
import styles from './Login.module.css';
import Header from '../Header/Header';
import { WebSocketContext } from '../WebSocket/WebSocketProvider'; // Importa il contesto WebSocket

function Login({ menuOpen, setMenuOpen }) {
  const [isLoginSlideUp, setIsLoginSlideUp] = useState(false); // Track login/signup state
  const [loading, setLoading] = useState(false); // Stato di caricamento
  const [error, setError] = useState(null); // Stato di errore
  const navigate = useNavigate(); // Hook per la navigazione
  const { socket, setSocket } = useContext(WebSocketContext); // Usa il contesto WebSocket

  // Gestione del form di registrazione
  const handleSignupClick = () => {
    setIsLoginSlideUp(true); // Mostra il form di registrazione
  };

  // Gestione del form di login
  const handleLoginClick = () => {
    setIsLoginSlideUp(false); // Mostra il form di login
  };

  // Funzione per gestire il login
  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {

        // Salva il token e le informazioni dell'utente nel sessionStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userID', data.user.id);
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.removeItem('tempUserId');

        const username = sessionStorage.getItem('username')

        socket.emit('user-logged-in', username )
        navigate('/'); // Reindirizza alla pagina di Homepage
      } 
      else {
        throw new Error(data.message || 'Login fallito');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per gestire la registrazione e il login automatico
  const handleSignup = async () => {
    const username = document.getElementById('usernameRegistrazione').value;
    const password = document.getElementById('passwordRegistrazione').value;

    if (!username || !password) {
      alert('Username o password mancanti');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Registrazione
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registrazione riuscita, esegui il login automatico
        await handleLogin(username, password);
      } else {
        throw new Error(data.message || 'Registrazione fallita');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Stato di caricamento
  if (loading) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.loading}>Loading...</div>
      </>
    );
  }

  // Stato di errore
  if (error) {
    return (
      <>
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.error}>Error: {error}</div>
      </>
    );
  }

  // Moduli di login e registrazione
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={styles.container}>
        <div className={styles.formStructor}>
          {/* Modulo di registrazione */}
          <div className={`${styles.signup} ${isLoginSlideUp ? '' : styles.SlideUp}`}>
            <h2 className={styles.formTitle} id="signup" onClick={handleSignupClick}>
              <span>or</span>Sign up
            </h2>
            <div className={styles.formHolder}>
              <input id="usernameRegistrazione" type="email" className={styles.input} placeholder="Username" />
              <input id="passwordRegistrazione" type="password" className={styles.input} placeholder="Password" />
            </div>
            <button className={styles.submitBtn} onClick={handleSignup}>
              Sign up
            </button>
          </div>

          {/* Modulo di login */}
          <div className={`${styles.login} ${!isLoginSlideUp ? '' : styles.SlideUp}`}>
            <div className={styles.center}>
              <h2 className={styles.formTitle} id="login" onClick={handleLoginClick}>
                <span>or</span>Log in
              </h2>
              <div className={styles.formHolder}>
                <input id="usernameLogin" type="email" className={styles.input} placeholder="Username" />
                <input id="passwordLogin" type="password" className={styles.input} placeholder="Password" />
              </div>
              <button
                className={styles.submitBtn}
                onClick={() => handleLogin(
                  document.getElementById('usernameLogin').value,
                  document.getElementById('passwordLogin').value
                )}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;