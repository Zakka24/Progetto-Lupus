// roleAssignmentHandler.js

export const handleRoleAssignment = (socket, roleData) => {
    console.log(`Assegnazione del ruolo a ${roleData.username}: ${roleData.role}`);
    
    // Aggiungi qui la logica per l'assegnazione del ruolo, ad esempio consultando il DB o modificando lo stato
    socket.emit('role-assigned', { username: roleData.username, role: roleData.role });
};
