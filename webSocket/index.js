// index.js
import { handleAuthentication } from './handlers/authenticationHandler.js';
import { handleRoleAssignment } from './handlers/roleAssignmentHandler.js';
import { handleConnection } from './handlers/connectionHandler.js';

import { Server } from 'socket.io';

let io;

export const initializeWebSocket = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`Utente connesso: ${socket.id}`);
        
        // Eventi per login e logout
        socket.on('user-logged-in', (data) => {
            console.log(`${data.username} ha effettuato il login`);
        });

        socket.on('user-logged-out', (data) => {
            console.log(`${data.username} ha effettuato il logout`);
        });

        // Eventuale logica di disconnessione
        socket.on('disconnect', () => {
            console.log(`Utente disconnesso: ${socket.id}`);
        });
    });
};

export { io };
