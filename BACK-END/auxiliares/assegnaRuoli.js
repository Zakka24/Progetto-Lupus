// Funzione per assegnare i ruoli casualmente
function assegnaRuoli(utenti, ruoli) {
    let assegnazioni = {};

    utenti.forEach((utente, index) => {
        // Seleziona casualmente un ruolo dall'array ruoli
        let indiceCasuale = Math.floor(Math.random() * ruoli.length);
        
        // Assegna il ruolo all'utente i-esimo
        assegnazioni[utente] = ruoli[indiceCasuale];

        // Rimuovi il ruolo dall'array ruoli per evitare duplicazioni
        ruoli.splice(indiceCasuale, 1);
    });

    return assegnazioni;
}

export default { assegnaRuoli };