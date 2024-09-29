// Tutto il codice che collega il server all'app
import mysql from 'mysql2'
import api from './controllers/ruoli.js'

import dotenv from 'dotenv'
dotenv.config(); 

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
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

// Funzione per eliminare un ruolo dato l'idq
async function deleteRuoloById(id){
    pool.query("DELETE FROM ruoli WHERE id = ?", [id])
}

export default {
    newUtente, getUtenteById, getUtenteByUsername, getUtenti, updateAuthStatus, getRuoli,
    createRuolo, getRuoloById, getRuoloByName, updateRoleAttributes, deleteRuoloById
};







