// Tutto il codice che collega il server all'app
import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config(); 

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,        
    user: process.env.MYSQLUSER,        
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
}).promise();


// Funzione per creare un nuovo utente
async function newUtente(username, password){
    const [result] = await pool.query("INSERT INTO utenti (username, password) VALUES (?, ?)", [username, password]);
    const id = result.insertId;
    return getUtenteById(id);
}

// Funzione per ritornare le info di un utente dato l'username
async function getUtenteByUsername(username){
    const [user] = await pool.query("SELECT * FROM utenti WHERE username = ? ", [username])
    return user;
}

// Funzione per ritornare le info di un utente dato l'id
async function getUtenteById(id){
    const [user] = await pool.query("SELECT * FROM utenti WHERE id = ?", [id])
    return user;
}

// Funzione per ottenere tutti gli utenti presenti nel database
async function getUtenti(){
    const [user] = await pool.query("SELECT * from utenti");
    return user;
}

// Funzione per aggiornare lo stato_autenticato di un dato utente
async function updateAuthStatus(username, tkn = ""){
    if(tkn){
        await pool.query("UPDATE utenti SET stato_autenticato = false WHERE username = ?", [username]);
    }
    else{
        await pool.query("UPDATE utenti SET stato_autenticato = true WHERE username = ?", [username]);
    }
}

// Funzione per ottenere tutti i ruoli presenti nel database
async function getRuoli() {
    const [ruoli] = await pool.query("SELECT * from ruoli");
    return ruoli
}


// Funzione per creare un nuovo ruolo (nome, parte, descrizione)
async function createRuolo(nome, parte, descrizione){
    const [result] = await pool.query("INSERT INTO ruoli (nome, parte, descrizione) VALUES (?, ?, ?)", [nome, parte, descrizione]);
    const id = result.insertId;
    return getRuoloById(id);
}

// Funzione per ritornare le info di un ruolo dato l'id
async function getRuoloById(id){
    const [ruolo] = await pool.query("SELECT * FROM ruoli WHERE id = ? ", [id])
    return ruolo;
}

// Funzione per ritornare le info di un ruolo dato il nome
async function getRuoloByName(nome){
    const [ruolo] = await pool.query("SELECT * FROM ruoli WHERE nome = ? ", [nome])
    return ruolo;
}

async function updateRoleAttributes(nome = "", parte = "", descrizione = "", id){
    let query = "UPDATE ruoli SET "
    let values = []

    if(nome){
        query += "nome = ?, "
        values.push(nome)
    }
    if(parte){
        query += "parte = ?, "
        values.push(parte)
    }
    if(descrizione){
        query += "descrizione = ?, "
        values.push(descrizione)
    }

    // Rimuovo l'ultima virgola e aggiungo condizione WHERE
    query = query.slice(0, -2) + " WHERE id = ?";
    values.push(id)

    console.log(query)

    //Eseguo la query
    await pool.query(query, values)

    // ritorno le informazioni del ruolo aggiornate
    return getRuoloById(id)
}

// Funzione per eliminare un ruolo dato l'id
async function deleteRuoloById(id){
    pool.query("DELETE FROM ruoli WHERE id = ?", [id])
}

// Funzione per creare una nuova sessione con ruoli assegnati
async function creaSessione(adminId, ruoliSelezionati, utentiConnessi) {
    // Crea la sessione
    const [result] = await pool.query("INSERT INTO sessioni (admin_id) VALUES (?)", [adminId]);
    const sessioneId = result.insertId;

    // Assegna i ruoli agli utenti connessi
    if (utentiConnessi.length !== ruoliSelezionati.length) {
        throw new Error('Il numero di ruoli selezionati non corrisponde al numero di utenti connessi.');
    }

    // Assegna ciascun ruolo a ciascun utente
    for (let i = 0; i < utentiConnessi.length; i++) {
        const utenteId = utentiConnessi[i].id;
        const ruoloId = ruoliSelezionati[i];

        // Inserisci nella tabella ruoli_assegnati
        await pool.query(
            "INSERT INTO ruoli_assegnati (sessione_id, utente_id, ruolo_id) VALUES (?, ?, ?)", 
            [sessioneId, utenteId, ruoloId]
        );
    }
}
// Funzione per ottenere solo gli utenti autenticati (quelli connessi)
async function getUtentiInSessione(){
    const [utenti] = await pool.query("SELECT * FROM utenti, sessioni WHERE utenti.sessione_id = sessioni.sessione_id");
    return utenti;
}

// Ritorna i dettagli della sessione creata, dato l'id
async function getSessioneById(sessioneId){
    const [sessione] = await  pool.query("SELECT * FROM sessioni WHERE id = ?", [sessioneId])
    return sessione
}

// Ritorna i dettagli della sessione creata, dato l'id
async function getSessioni(){
    const [sessioni] = await  pool.query("SELECT * FROM sessioni")
    return sessioni
}

// L'admin che una sessione
async function adminCreaSessione(adminId){
    const [result] = await pool.query("INSERT INTO sessioni (admin_id) VALUES (?)", [adminId])
    const sessioneId = result.insertId;
    return getSessioneById(sessioneId)
}

async function updateSessioneEntraUtente(id_sessione, id_utente){
    const [result] = await pool.query("UPDATE utenti SET sessione_id = ? WHERE id = ?", [id_sessione, id_utente])
    return getUtenteById(id_utente)
}

async function updateSessioneEsceUtente(id_utente){
    const [result] = await pool.query("UPDATE utenti SET sessione_id = 0 WHERE id = ?", [id_utente])
    return getUtenteById(id_utente)
}


export default {
    newUtente, getUtenteById, getUtenteByUsername, getUtenti, updateAuthStatus, getRuoli,
    createRuolo, getRuoloById, getRuoloByName, updateRoleAttributes, deleteRuoloById,
    creaSessione, getSessioneById, getUtentiInSessione, adminCreaSessione, updateSessioneEntraUtente, 
    updateSessioneEsceUtente, getSessioni
}