// connectionHandler.js

export const handleConnection = (socket) => {
    console.log(`Un utente si è connesso con id ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Utente con id ${socket.id} si è disconnesso`);
    });
};
