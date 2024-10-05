import express from 'express';
import http from 'http' // import per creare il server HTTP
import { initializeWebSocket } from './webSocket/socket.js';  // Importa la logica WebSocket

// import delle routes da ./routes
import routerAuth from './routes/autenticazione.js'
import routerUsers from './routes/utenti.js'
import routerRoles from './routes/ruoli.js'
import routerSessione from './routes/sessioni.js';
 
// import di tockenChecker
import { tokenChecker} from './tokenChecker.js'


const app = express();
const server = http.createServer(app)

app.use(express.json())
// app.use(express.static('client'));
//app.use(tokenChecker)

// Inizializza WebSocket
initializeWebSocket(server);

// Lancia il server
server.listen(8080, () => {
    console.log('Server running on porto 8080')
});

// Autenticazione: '/api/auth' è il prefisso per tutte le rotte di autenticazione
app.use('/api/auth', routerAuth); 
//app.use('/api/auth/logout', tokenChecker);

// Utenti: '/api/users' è il prefisso per tutte le rotte per gli user
app.use('/api/users', routerUsers)

// Ruoli: '/api/roles' è il prefisso per tutte le rotte per i ruoli
app.use('/api/roles', routerRoles)

// Sessioni: '/api/sessions' è il prefisso per tutte le rotte per le sessioni
app.use('/api/sessions', routerSessione)
