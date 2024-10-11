import React from 'react';
import styles from './Descrizione.module.css';

function Descrizione() {
  return (
    <div className={`${styles.descrizioneContainer}`}>
      <h2>Regole del Gioco</h2>
      <p>
        Benvenuto nel gioco! Ecco alcune regole che dovrai seguire:
      </p>
      <ul>
        <li>Ogni giocatore deve avere almeno 1 punto per partecipare.</li>
        <li>Ogni turno, un giocatore deve lanciare il dado per determinare il numero di mosse.</li>
        <li>Un giocatore non può fare più di 3 mosse consecutive.</li>
        <li>Il gioco termina quando un giocatore raggiunge il punteggio massimo di 100 punti.</li>
        <li>In caso di pareggio, verrà effettuata una partita supplementare.</li>
      </ul>
      <p>
        Buona fortuna e che vinca il migliore!
      </p>
    </div>
  );
}

export default Descrizione;