import express from 'express';
import bcrypt from 'bcrypt'; // libreria per hashare la password
import jwt from 'jsonwebtoken' // Libreria per creare il token
import { tokenChecker} from './tokenChecker.js'
import routerAuth from './routes/autenticazione.js'
import routerUsers from './routes/utenti.js'
import routerRoles from './routes/ruoli.js'
 

const app = express();
app.use(express.json())
//app.use(tokenChecker)

// Lancia il server
app.listen(8080, () => {
    console.log('Server running on porto 8080')
});
 

// Autenticazione: '/api/auth' è il prefisso per tutte le rotte di autenticazione
app.use('/api/auth', routerAuth); 
app.use('api/auth/logout', tokenChecker);

// Utenti: '/api/users' è il prefisso per tutte le rotte per gli user
app.use('/api/users', routerUsers)

// Utenti: '/api/roles' è il prefisso per tutte le rotte per i ruoli
app.use('/api/roles', routerRoles)

