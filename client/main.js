// Importa la libreria per il client WebSocket
const socket = io('http://localhost:8080');  // Assicurati che l'URL sia corretto

// Ascolta l'evento 'user-logged-in' inviato dal server
socket.on('user-logged-in', (data) => {
    console.log(`${data.username} ha effettuato il login.`);
    alert(`${data.username} ha effettuato il login.`);
});

// Ascolta l'evento 'user-logged-out' inviato dal server
socket.on('user-logged-out', (data) => {
    console.log(`${data.username} ha effettuato il logout.`);
    alert(`${data.username} ha effettuato il logout.`);
});



