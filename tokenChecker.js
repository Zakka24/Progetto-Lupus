// Controlla se il token fornito è corretto
import jwt from 'jsonwebtoken' // Libreria per creare il token

export function tokenChecker(req, res, next) {
    var tkn = req.headers['x-access-token'];

    // Se non c'è un token
    if (!tkn) {
        return res.status(401).send({ 
            success: false,
            message: 'Token non fornito'
        });
    }

    // Decodifica il token, verifica il segreto e controlla la scadenza
    jwt.verify(tkn, process.env.SECRET_KEY, function(err, decoded) {            
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Token non valido!'
            });		
        } else {
            req.loggedUser = decoded; // Salva i dettagli dell'utente decodificato
            next(); // Passa al prossimo middleware o rotta
        }
    });
};