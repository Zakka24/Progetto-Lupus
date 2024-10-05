-- Crea il database
CREATE DATABASE lupus;
USE lupus;

-- Tabella dei ruoli
CREATE TABLE ruoli (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    parte ENUM('Buono', 'Cattivo', 'Gioca da solo') NOT NULL,
    descrizione VARCHAR(1000)
);

-- Tabella degli utenti
CREATE TABLE utenti (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- memorizza password hashata
    stato_autenticato BOOLEAN DEFAULT FALSE,
    sessione_id INT
);

-- Tabella delle sessioni
CREATE TABLE sessioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT, -- riferimento all'admin che ha creato la sessione
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES utenti(id)
);

-- -- Tabella dei ruoli assegnati (ruoli per utente in una sessione)
-- CREATE TABLE ruoli_assegnati (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     sessione_id INT,
--     utente_id INT,
--     ruolo_id INT,
--     FOREIGN KEY (sessione_id) REFERENCES sessioni(id),
--     FOREIGN KEY (utente_id) REFERENCES utenti(id),
--     FOREIGN KEY (ruolo_id) REFERENCES ruoli(id),
--     UNIQUE KEY (sessione_id, utente_id) -- impedisce di assegnare più ruoli allo stesso utente in una sessione
-- );
