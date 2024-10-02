import db from '../database.js'

// // Array di utenti e ruoli (stessa lunghezza)
// let utenti = ['utente1', 'utente2', 'utente3', 'utente4', 'utente5', 'utente6', 'utente7'];
// let ruoli = ['ruolo1', 'ruolo2', 'ruolo3', 'ruolo4', 'ruolo5', 'ruolo6', 'ruolo7'];

// Funzione per selezionare casualmente un ruolo, assegnarlo e rimuoverlo dall'array
function assegnaRuoli(utenti, ruoli) {
    // Creiamo una mappa per tracciare a chi è assegnato ciascun ruolo
    let assegnazioni = {};

    utenti.forEach((utente, index) => {
        // Selezioniamo casualmente un indice dall'array ruoli
        let indiceCasuale = Math.floor(Math.random() * ruoli.length);
        
        // Assegniamo il ruolo all'utente i-esimo
        assegnazioni[utente] = ruoli[indiceCasuale];

        // Rimuoviamo il ruolo dall'array ruoli
        ruoli.splice(indiceCasuale, 1); // Questo rimuove l'elemento all'indiceCasuale
    });

    return assegnazioni;
}

export default {assegnaRuoli};