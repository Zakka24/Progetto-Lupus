import express from 'express';
import http from 'http'; // Import per creare il server HTTP
import cors from 'cors'; // Import del middleware CORS
import { initializeWebSocket } from './webSocket/socket.js'; // Importa la logica WebSocket

// Import delle routes
import routerAuth from './routes/autenticazione.js';
import routerUsers from './routes/utenti.js';
import routerRoles from './routes/ruoli.js';
import routerSessione from './routes/sessioni.js';

// Import di tokenChecker
import { tokenChecker } from './tokenChecker.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());

// Configura CORS per consentire richieste da http://127.0.0.1:5173
app.use(cors({
  origin: 'https://progetto-lupus.vercel.app', // Origine consentita
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Metodi HTTP consentiti
  credentials: true // Per gestire i cookie o altre credenziali
}));

// Inizializza WebSocket
initializeWebSocket(server);

// Lancia il server
server.listen(8080, () => {
  console.log('Server running on port 8080');
});

// Autenticazione: '/api/auth' è il prefisso per tutte le rotte di autenticazione
app.use('/api/auth', routerAuth);
app.use('api/auth/logout/:username', tokenChecker)

// Utenti: '/api/users' è il prefisso per tutte le rotte per gli user
app.use('/api/users', routerUsers);

// Ruoli: '/api/roles' è il prefisso per tutte le rotte per i ruoli
app.use('/api/roles', routerRoles); // Ottenere tutti i ruoli
app.use('/api/roles/new-role', tokenChecker); // Creare un nuovo ruolo
app.use('/api/roles/:id', tokenChecker); // Aggiornare un attributo di un ruolo o eliminarlo

// Sessioni: '/api/sessions' è il prefisso per tutte le rotte per le sessioni
app.use('/api/sessions', routerSessione); // Ottenere info di una sessione/tutte le sessioni
app.use('/api/sessions/new-session/:admin_id', tokenChecker); // Creare una nuova sessione
app.use('/api/sessions/entra-sessione/id_utente/id_sessione', tokenChecker); // Entrare in una sessione
app.use('/api/sessions/esce-sessione/id_utente/', tokenChecker); // Uscire da una sessione
