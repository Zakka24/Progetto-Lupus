// Importa la libreria per il client WebSocket
const socket = io('http://localhost:8080');  // Assicurati che l'URL sia corretto

// Ascolta l'evento 'user-logged-in' inviato dal server e fai cose: Modifica per l'utente entra nella sessione
socket.on('user-logged-in', (data) => {
    console.log(`${data.username} ha effettuato il login.`);
    alert(`${data.username} ha effettuato il login.`);
});

// Ascolta l'evento 'user-logged-out' inviato dal server e fai cose: Modifica per l'utente esce dalla sessione
socket.on('user-logged-out', (data) => {
    console.log(`${data.username} ha effettuato il logout.`);
    alert(`${data.username} ha effettuato il logout.`);
});

// Ricevi notifiche di nuove sessioni e fai cose
socket.on('new-session-available', (data) => {
    console.log('Nuova sessione disponibile: ', data);
})



