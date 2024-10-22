import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import aux from '../auxiliares/assegnaRuoli.js'; // Importa la funzione per assegnare i ruoli

let io;
const sessions = {}; // Oggetto per tenere traccia delle sessioni e degli utenti

export const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'https://progetto-lupus.vercel.app', // Consenti richieste dall'origine del front-end
            methods: ['GET', 'POST'],
            credentials: true, // Se devi gestire i cookie o altre credenziali
        }
    });

    io.on('connection', (socket) => {
        const token = socket.handshake.query.token;
        const tempUserId = socket.handshake.query.tempUserId;

        // Verifica se l'utente ha un token valido (utente autenticato)
        if (token && token !== 'null' && token !== 'undefined') {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log('Errore durante la verifica del token:', err.message);
                } else {
                    console.log(`Utente autenticato via WebSocket: ${decoded.username}, (${socket.id})`);
                    socket.username = decoded.username;
                }
            });
        } else if (tempUserId && tempUserId !== 'null' && tempUserId !== 'undefined') {
            console.log(`Utente non autenticato connesso via WebSocket: ${tempUserId}, (${socket.id})`);
            socket.username = tempUserId;
        } else {
            console.log('Connessione non valida, nessun token o tempUserId fornito');
            socket.disconnect();
        }

        // Quando l'utente entra in una sessione
        socket.on('entra-sessione', (data) => {
            const { username, sessionID } = data;
            console.log(`Utente ${username} è entrato nella sessione ${sessionID}`);

            // Se la sessione non esiste, creala
            if (!sessions[sessionID]) {
                sessions[sessionID] = {
                    users: [],
                    maxUsers: 0,
                    socketIds: {} // Aggiungiamo un oggetto per tracciare gli ID dei socket
                };
            }

            // Aggiungi l'utente alla sessione se non esiste già
            if (!sessions[sessionID].users.includes(username)) {
                sessions[sessionID].users.push(username);
                sessions[sessionID].socketIds[username] = socket.id; // Traccia l'ID del socket dell'utente
            }

            const userCount = sessions[sessionID].users.length;

            io.emit('update-user-count', {
                sessionID,
                userCount,
                maxUsers: sessions[sessionID].maxUsers,
                usernames: sessions[sessionID].users
            });
        });

        // Quando la sessione viene creata dall'admin
        socket.on('sessione-creata', (data) => {
            console.log(`Sessione ${data.sessionID} creata da ${data.username}`);
            console.log("Salvataggio adminSocketId: ", socket.id); // Log per verificare socket.id
        
            sessions[data.sessionID] = {
                users: [],
                maxUsers: data.selectedRoles.length,
                selectedRoles: data.selectedRoles,
                socketIds: {},
                adminSocketId: socket.id // Salvataggio dell'ID del socket dell'admin
            };
        
            io.emit('sessione-creata', {
                sessionID: data.sessionID,
                maxUsers: sessions[data.sessionID].maxUsers
            });
        });

        // Quando l'admin avvia la sessione
        socket.on('start-session', (data) => {
            const { sessionID, username, selectedRoles } = data;
            console.log(`Sessione ${sessionID} avviata dall'admin ${username}`);
        
            // Verifica che la sessione esista e che ci siano utenti connessi
            if (sessions[sessionID] && sessions[sessionID].users.length > 0) {
        
                // Usa selectedRoles inviato dal client
                const utenti = sessions[sessionID].users;
        
                // Controlla se selectedRoles è un array valido prima di iterarlo
                if (!Array.isArray(selectedRoles) || selectedRoles.length === 0) {
                    console.log('Errore: selectedRoles non è valido o vuoto', selectedRoles);
                    return;
                }
        
                // Assegna i ruoli casualmente agli utenti
                const assegnazioni = aux.assegnaRuoli(utenti, [...selectedRoles]);
        
                console.log(assegnazioni);
        
                utenti.forEach((utente) => {
                    const socketId = sessions[sessionID].socketIds[utente];
                    if (socketId) {
                        io.to(socketId).emit('ruolo-assegnato', {
                            username: utente,
                            ruolo: assegnazioni[utente],
                        });                        
                    }
                });
        
                const adminSocketId = sessions[sessionID].adminSocketId;
                
                if(adminSocketId){
                    io.to(adminSocketId).emit('assegnazioni-admin', assegnazioni);
                }
                else{
                    console.log('Errore: adminSocketId non trovato')
                }
        
                io.emit('session-started', {
                    sessionID,
                    message: `La sessione ${sessionID} è iniziata!`,
                });
            } else {
                console.log('Errore: Non ci sono utenti in questa sessione');
            }
        });

        socket.on('disconnect', () => {
            console.log(`Utente disconnesso: ${socket.id}`);
        });
    });
};

export { io };