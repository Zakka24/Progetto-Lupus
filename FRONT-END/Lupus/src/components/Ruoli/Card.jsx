import styles from './Card.module.css';

function Card({ items }) {
  // Supporta sia la visualizzazione di un ruolo singolo (stringa) che di un array di ruoli
  const renderItems = Array.isArray(items) ? items : [items];

  const listRuoli = renderItems.map((item, index) => (
    <div className={styles.card} key={index}>
      <img
        alt="profile picture"
        className={styles.cardImage}
        src={`/profilePics/${item.nome}.jpeg`} // Percorso immagine
      />
      <h2 className={styles.cardTitle}>{item.nome}</h2>
      <p>{item.parte}</p>
      <p>{item.descrizione}</p>
    </div>
  ));

  return <div className={styles.cardContainer}>{listRuoli}</div>;
}

export default Card;
