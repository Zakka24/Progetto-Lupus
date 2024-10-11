import db from '../database.js'; // Query/funzioni varie


// Ritorna una lista di tutti i ruoli presenti nel database
const getRoles = async (req, res) => {
    try{
        // Ottengo tutti i ruoli usando la funzione 'getRuoli' presente nel file database.js
        const roles = await db.getRuoli()

        // Controllo se esistono dei ruoli nel database
        if(roles.length === 0){
            return res.status(404).json({success: false, message: "Nessun ruolo presente nel database"})
        }

        // Creo un array di ruoli. Uso la funzione map per poter mappare ogni ruolo ottenuto dalla chiamata alla funzione 'getRuoli' all'array ruoli.
        const ruoli = roles.map(ruolo => ({
            id: ruolo.id,
            nome: ruolo.nome,
            parte: ruolo.parte,
            descrizione: ruolo.descrizione,
        }))
        return res.status(200).json({success: true, roles: ruoli})
    }
    catch (error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
    
};


// Crea un nuovo ruolo dati nome, parte e descrizione come input
const newRuolo = async (req, res) => {
    try{
        // Ottengo gli attributi del ruolo dal body
        const {nome, parte, descrizione} = req.body

        // Controllo se siano stati inseriti tutti
        if(!nome || !parte || !descrizione){
            return res.status(400).json({success: false, message: "Informazioni inserite errate. Inserire nome, parte, descrizione del ruolo"})
        }

        // Verifica che il ruolo non esista già nel database
        const existingRole = await db.getRuoloByName(nome)
        if(existingRole.length > 0){
            return res.status(409).json({success: false, message: "Il ruolo è già presente nel database"})
        }

        // Crea il nuovo ruolo. Uso la funzione 'createRuolo()' presente nel file database.js
        const newRole = await db.createRuolo(nome, parte, descrizione)
        return res.status(201).json({success: true, message: "Nuovo ruolo aggiunto al database", ruolo: newRole})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

// Aggiorna gli attributi passati come body di un ruolo.
const updateAttributes = async (req, res) => {
    // Ottengo l'id dall'url della chiamata all'API
    const { id } = req.params
    // Ottengo gli attributi da modificare dal body
    const { nome, parte, descrizione } = req.body

    // Controllo se questo ruolo esiste
    const existingRole = await db.getRuoloById(id)
    if(existingRole === 0){
        res.status(404).json({success: false, message: "Ruolo non trovato nel database"});
    }
    
    // Modifico gli attributi passati come body usando la funzione 'updateRolesAttributes()' presente nel file database.js
    const result = await db.updateRoleAttributes(nome, parte, descrizione, id)
    return res.status(200).json({success: true, message: "Informazioni aggiornate", role: result})
}

const deleteRuolo = async (req, res) =>{
    try{
        // Ottengo l'id dall'url della chiamata all'API
        const { id }  = req.params

        // Controllo se il ruolo esiste
        const ruolo = await db.getRuoloById(id)
        if(ruolo.length === 0){
            return res.status(404).json({success: false, message: "Ruolo non presente nel database"})
        }

        // Elimino il ruolo usando la funzione 'deleteRuoloById()' presente nel file database.js
        await db.deleteRuoloById(id)

        // Ottengo la nuova lista di ruoli usando la funzione 'getRuoli()' presente nel file database.js
        const NewListRuoli = await db.getRuoli()
        return res.status(200).json({success: true, message: "Ruolo eliminato correttamente", roles: NewListRuoli})
    }
    catch(error){
        return res.status(500).json({success: false, message: "Errore del server", error: error.message})
    }
}

const getRuolo = async(req, res) => {
    const { id } = req.params;

    const ruolo = await db.getRuoloById(id);

    if(ruolo.length === 0){
        return res.status(404).json({success: false, message: "Ruolo non presente nel database"})
    }

    return res.status(200).json({success: true, message: "Ruolo trovato", ruolo: ruolo})
}



export default {getRoles, newRuolo, updateAttributes, deleteRuolo, getRuolo};