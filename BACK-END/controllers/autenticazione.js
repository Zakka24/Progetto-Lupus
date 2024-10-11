import jwt from 'jsonwebtoken' // Libreria per creare il token
import bcrypt from 'bcrypt'; // libreria per hashare la password
import db from '../database.js'; 
import { io } from '../webSocket/socket.js' // Importa la logica WebSocket

// ALL DONE

// API per creare un nuovo utente (registrazione)
const register = async (req, res) => {
    try{
        // Ottengo username e password dal body della richiesta
        const {username, password} = req.body;

        // Verifica che username e password siano passati correttamente
        if (!username || typeof username !== 'string' || !password) {
            return res.status(400).json({ success: false, message: "Username o password mancanti o non validi" });
        }
        // Controllo se l'utene esiste già
        const existingUser = await db.getUtenteByUsername(username);
        if(existingUser.length > 0){
            return res.status(409).json({success: false, message: "Username già presente nel database"});
        }

        // Controllo lunghezza password
        if(password.length < 8){
            return res.status(400).json({success: false, message: "La password deve contenere almeno 8 caratteri"})
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea il nuovo utente
        const newUser = await db.newUtente(username, hashedPassword);
        return res.status(201).json({success: true, message: "Utente creato correttamente", user: newUser});
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
};

// API per effettuare il login
const login = async (req, res) => {
    try{
        // Ottengo username e password dal body della richiesta
        const {username, password} = req.body;

        // Ottengo le informazioni dell'utente usando la funzione 'getUtenteByUsername()' presente nel file database.js
        const user = await db.getUtenteByUsername(username);

        // Controllo che l'utente esista nel database
        if(user.length === 0){
            return res.status(404).json({success: false, message: "Username o password errati"});
        }

        // Controllo che la password sia corretta
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Password errata"})
        }

        const userData = Array.isArray(user) ? user[0] : user;

        // Creo il token
        let payload = {username: username};
        let options = {expiresIn: 23200};
        let tkn = jwt.sign(payload, process.env.SECRET_KEY, options);

        // Aggiorno lo stato_autenticato dell'utente a true e ritorno la risposta
        await db.updateAuthStatus(username);

        // Invia un messaggio WebSocket al client autenticato
        io.to(req.socket.id).emit('auth-success', { username });

        return res.status(200).json({
            success: true, 
            message: "Benvenuto nel tuo account, " + username + "!", 
            token: tkn,
            user: {id: userData.id, username: userData.username}
        });
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
};

// API per effettuare il logout
const logout = async (req, res) => {
    try{
        // Ottengo username dell'utente dall'url della chiamata dell'API
        let { username } = req.params

        // Ottengo il token dall'header della chiamata
        let tkn = req.headers['authorization'];

        // Se il token esiste, allora lo elimino e aggiorno lo stato_autenticato dell'utente a false. Ritorno la risposta
        if(tkn){
            let payload = {};
            let options = {expiresIn: 1};
            let tkn = jwt.sign(payload, process.env.SECRET_KEY, options);
            await db.updateAuthStatus(username, tkn);

            return res.status(200).json({success: true, message: "Logout eseguito correttamente"});
        }
        // Se il token non esiste ritorno un errore
        else{
            return res.status(400).json({success: false, message: "Logout fallito"});
        }
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
};


export default {register, logout, login}