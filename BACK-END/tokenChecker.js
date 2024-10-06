// Controlla se il token fornito è corretto
import jwt from 'jsonwebtoken'; // Libreria per creare e verificare il token

export function tokenChecker(req, res, next) {
    // Estrai il token dall'header Authorization (Formato: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    
    // Se l'header Authorization non è presente o non è nel formato corretto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ 
            success: false,
            message: 'Token non fornito o formato errato'
        });
    }

    // Estrai il token rimuovendo "Bearer "
    const token = authHeader.split(' ')[1];

    // Decodifica il token, verifica il segreto e controlla la scadenza
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Token non valido o scaduto!'
            });		
        } else {
            req.loggedUser = decoded; // Salva i dettagli dell'utente decodificato
            next(); // Passa al prossimo middleware o rotta
        }
    });
};
