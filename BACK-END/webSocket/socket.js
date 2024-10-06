import { Server } from 'socket.io';

let io;

export const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://127.0.0.1:5173', // Consenti richieste dall'origine del front-end
            methods: ['GET', 'POST'], // Metodi consentiti
            credentials: true, // Se devi gestire i cookie o altre credenziali
        }
    });

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
