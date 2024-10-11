import db from '../database.js'; 
import { io } from '../webSocket/socket.js' // Importa la logica WebSocket

// Crea una nuova sessione di gioco
const creaNuovaSessione = async (req, res) => {
    try{
        // Ottengo id e gli id dei ruoli scelti rispettivamente dall'url alla chiamata dell'API e dal body
        const { admin_id } = req.params
        const { ruoliSelezionati } = req.body

        // Controllo che l'id dell'admin effettivamente esisti
        const existingAdmin = await db.getUtenteById(admin_id)
        if(existingAdmin.length === 0){
            return res.status(404).json({success: false, message: "Utente non trovato nel database"})
        }

        // Verifica che `ruoliSelezionati` sia un array
        if (!Array.isArray(ruoliSelezionati)) {
            return res.status(400).json({ success: false, message: "ruoliSelezionati deve essere un array" });
        }

        // Mappa gli ID dei ruoli e controlla che tutti esistano
        const checkRoles = await Promise.all(
            ruoliSelezionati.map(async (ruoloId) => {
                let role = await db.getRuoloById(ruoloId);
                return role.length > 0; // Ritorna true se il ruolo esiste
            })
        );

        // Se qualche ruolo non esiste, restituisce un errore
        if (checkRoles.includes(false)) {
            return res.status(404).json({ success: false, message: "Non tutti i ruoli esistono nel database" });
        }

        // L'admin crea la sessione: 
        const newSession = await db.adminCreaSessione(admin_id);

        return res.status(201).json({success: true, message: "Sessione creata correttamente", sessione: newSession})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }      
}

// API che aggiorna l'attributo 'sessione_id' della tabella 'utenti' all'id passato per parametro
const utenteEntraInSessione = async (req, res) => {
    try{
        const { id_sessione, id_utente } = req.params

        // Controllo che l'id dell'utente effettivamente esisti
        const existingUser = await db.getUtenteById(id_utente)
        if(existingUser.length === 0){
            return res.status(404).json({success: false, message: "Utente non trovato nel database"})
        }
        
        // Controllo che l'id della sessione effettivamente esisti
        const existingSession = await db.getSessioneById(id_sessione)
        if(existingSession.length === 0){
            return res.status(404).json({success: false, message: "La sessione non esiste"})
        }

        // Aggiorno l'attributo 'sessione_id' dell'utente
        await db.updateSessioneEntraUtente(id_sessione, id_utente)

        return res.status(200).json({success: true, message: "Attributo sessione correttamente aggiornato"}, )
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

// API che aggiorna l'attributo 'sessione_id' della tabella 'utenti' a '0'. '0' indica che l'utente non è in nessuna sessione
const utenteEsceDaSessione = async (req, res) => {
    try{
        const { id_utente } = req.params

        // Controllo che l'id dell'utente effettivamente esisti
        const existingUser = await db.getUtenteById(id_utente)
        if(existingUser.length === 0){
            return res.status(404).json({success: false, message: "Utente non trovato nel database"})
        }

        // Aggiorno l'attributo 'sessione_id' dell'utente
        await db.updateSessioneEsceUtente(id_utente)

        return res.status(200).json({success: true, message: "Attributo sessione correttamente aggiornato"})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

// API che ritorna tutte le sessioni attive
const getSessioni = async (req, res) => {
    try{
        // trovo tutte le sessioni attualmente presenti nel database
        const sesso = await db.getSessioni()

        // Controllo per vedere se ne esistono
        if(sesso.length === 0){
            return res.status(404).json({success: false, message: "Nessuna sessione trovata"});
        }

        // Mapping di tutte le sessioni trovate in un array di oggetti 'sessioni'
        const sessioni = sesso.map(sessione => ({
            id: sessione.id,
            admin_id: sessione.admin_id,
            data_creazione: sessione.data_creazione
        }))

        return res.status(200).json({success: true, message: "Sessioni trovate correttamente", sessioni: sessioni})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

// API che ritorna i dettagli di una sessione
const getSessione = async (req, res) => {
    try{
        const {sessione_id} = req.params
        const sessione = await db.getSessioneById(sessione_id)

        if(sessione.length === 0){
            return res.status(404).json({success: false, message: "Nessuna sessione trovata"});
        }
        return res.status(200).json({success: true, message: "Sessione trovata correttamente", sessione: sessione})
    }
    catch(error){
        return res.status(500).json({success: true, message: "Errore del server", error: error.message})
    }
}
export default {creaNuovaSessione, utenteEntraInSessione, utenteEsceDaSessione, getSessioni, getSessione}