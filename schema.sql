CREATE DATABASE lupus;
USE lupus

CREATE TABLE ruoli(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    parte ENUM('Buono', 'Cattivo', 'Gioca da solo') NOT NULL
    descrizione VARCHAR(1000)
);

CREATE TABLE utenti(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- memorizza password hashata
    stato_autenticato BOOLEAN DEFAULT FALSE,
    ruolo_id INT, -- riferimento al ruolo assegnatogli
    FOREIGN KEY (ruolo_id) REFERENCES ruoli(id)
);

CREATE TABLE sessioni(
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT, -- riferimento all'admin che ha creato la sessione
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES utenti(id)
);

CREATE TABLE ruoli_assegnati(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessione_id INT,
    utente_id INT,
    ruolo_id INT,
    FOREIGN KEY (sessione_id) REFERENCES sessioni(id),
    FOREIGN KEY (utente_id) REFERENCES utenti(id),
    FOREIGN KEY (ruolo_id) REFERENCES ruoli(id)
);


INSERT INTO ruoli(nome, parte, descrizione) VALUES
('Lupo', 'Cattivo', 'Di notte indica chi ammazzare'),
('Avvelenatore', 'Cattivo', 'Vince da solo. Di notte indica una persona la quale morirà di giorno. Muore qualche secondo prima di poter votare'),
('Guardia', 'Buono', 'Di notte indica una persona per proteggerla dai cattivi. Non può scegliere la stessa persona per due notti di fila. Può proteggere anche se stessa'),
('Vipera', 'Gioca da solo', 'Gioca con i buoni finchè non muore. Una volta morta, per poter vincere, deve guardare qualcuno negli occhi e fargli HHASSS. La persona che l avrà guardata morità. Vince se riesce ad ammazzare qualcuno.');