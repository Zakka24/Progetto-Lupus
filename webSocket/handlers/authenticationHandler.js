// authenticationHandler.js

export const handleAuthentication = (socket, data) => {
    console.log(`User ${data.userId} authenticated with token: ${data.token}`);

    // Puoi aggiungere altre logiche qui come inviare il ruolo, la stanza, ecc.
    // Emetti un messaggio di conferma o altre azioni da intraprendere
    socket.emit('auth-confirmation', { message: "Autenticazione avvenuta con successo!" });
};
