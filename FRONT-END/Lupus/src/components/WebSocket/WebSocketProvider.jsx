import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Crea il contesto per WebSocket e stato utente
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);  // Stato per l'utente loggato

  useEffect(() => {
    // Connessione al server WebSocket
    const socketIo = io('http://localhost:8080/');  
    setSocket(socketIo);

    // Ascolta eventi di login/logout
    socketIo.on('user-logged-in', (data) => {
      setUser(data.username);  // Imposta l'utente loggato
    });

    socketIo.on('user-logged-out', () => {
      setUser(null);  // Rimuovi l'utente al logout
    });

    // Pulizia: disconnessione del WebSocket al termine
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, user, setUser }}>
      {children}
    </WebSocketContext.Provider>
  );
};