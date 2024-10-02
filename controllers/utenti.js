import db from '../database.js';  // Query/funzioni varie


// Ritorna una lista di tutti gli utenti presenti nel database
const getUsers = async (req, res) => {
    try{
        // Ottengo un'array di oggetti chiamando la funzione 'getUtenti()' presente nel file database.js
        const users= await db.getUtenti()

        // Controllo che esista almeno un utente nel database
        if(users.length === 0){
            return res.status(404).json({succes: false, message: "Nessun utente presente nel database"})
        }

        // Creo un array di utenti. Uso la funzione map per poter mappare ogni utente ottenuto dalla chiamata alla funzione 'getUtenti' all'array utenti.
        const utenti = users.map(user => ({
            id: user.id,
            username: user.username,
            stato_autenticato: user.stato_autenticato,
        }))

        // Ritorno l'array di utenti
        return res.status(200).json({success: true, users: utenti})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
};

// Ritorna i dettagli di uno specifico utente. 
const getUser = async (req, res) => {
    try{
        // Ottengo l'utente del quale voglio ottenere i dettagli dall'url della chiamata all'API
        const id = req.params.id;

        // Ottengo le informazioni chiamando la funzione 'getUtenteById()' presente nel file database.js
        const user = await db.getUtenteById(id);

        // Controllo che l'utente esista
        if(user.length === 0){
            return res.status(404).json({success: false, message: "Utente non trovato"});
        }

        const utente = {
            id: user.id,
            username: user.username,
            stato_autenticato: user.stato_autenticato
        }

        // Ritorno le sue informazioni
        return res.status(200).json({success: true, user: utente})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

const updateAuthStatusUser = async (req, res) => {
    try{
        // Ottengo l'id dell'utente del quale voglio modificare lo stato_online dall'url della chiamata all'API
        const id = req.params.id;

        // Ottengo l'utente usando la funzione 'getUtenteById()' presente nel file database.js
        const user = await db.getUtenteById(id);

        // Verifica se l'utente esiste
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }

        // Prendo il token dalla richiesta
        const tkn = req.headers['x-access-token'];

        // Aggiorna lo stato di autenticazione in base alla presenza o meno del token
        await db.updateAuthStatus(username, tkn);

        // Ricarica l'utente per ottenere il nuovo stato dopo l'aggiornamento
        const updatedUser = await db.getUtenteById(id);

        // Rispondi basato sul nuovo valore di `stato_autenticato`
        return res.status(200).json({
            success: true,
            message: updatedUser.stato_autenticato === 0
                ? "Aggiornato l'online status a offline"  // Se `stato_autenticato` è 0, l'utente è offline
                : "Aggiornato l'online status a online",   // Se `stato_autenticato` è 1, l'utente è online
        });
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
};



export default {getUsers, getUser, updateAuthStatusUser};