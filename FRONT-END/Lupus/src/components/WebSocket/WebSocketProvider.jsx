import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Crea il contesto
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connessione al server WebSocket
        const socketIo = io('http://localhost:8080/');  // Assicurati che l'URL corrisponda al tuo server
        
        // Salva il socket nello stato
        setSocket(socketIo);

        // Pulizia: chiudi la connessione WebSocket quando il componente si smonta
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};