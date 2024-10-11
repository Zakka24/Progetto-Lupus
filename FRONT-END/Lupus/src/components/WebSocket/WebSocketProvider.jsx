import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Crea il contesto per WebSocket e stato utente
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userID');
      const username = sessionStorage.getItem('username');
  
      let tempUserId = sessionStorage.getItem('tempUserId');
  
      if (!token && !userId && !username && !tempUserId) {
        tempUserId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('tempUserId', tempUserId);
      }
  
      try {
        const socketIo = io('http://localhost:8080/', {
          query: { token, tempUserId }
        });
  
        setSocket(socketIo);
  
        socketIo.on('connect', () => {
          console.log('WebSocket connesso: ', socketIo.id);
        });
  
        socketIo.on('disconnect', (reason) => {
          console.log('WebSocket disconnesso:', reason);
        });
  
        socketIo.on('connect_error', (error) => {
          console.error('Errore di connessione WebSocket:', error);
        });
      } catch (error) {
        console.error('Errore durante la connessione al WebSocket:', error);
      }
  
      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [socket]);
  

  return (
    <WebSocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
