import React, { useEffect, useState, useContext } from 'react';
import styles from './FormRuoli.module.css';
import Header from '../Header/Header';
import { WebSocketContext } from '../WebSocket/WebSocketProvider';
import { useLocation, useNavigate } from 'react-router-dom';

function FormRuoli({ menuOpen, setMenuOpen }) {
    const [selectedRoles, setSelectedRoles] = useState([]); // Mantieni qui solo gli ID
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const { socket } = useContext(WebSocketContext);
    const navigate = useNavigate();
    const location = useLocation;
    
    useEffect(() => {
        const fetchRuoli = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/roles');
                const data = await response.json();

                if (response.ok) {
                    setRoles(data.roles);
                } else {
                    throw new Error(data.message || 'Failed to fetch roles');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRuoli();
    }, []);

    // Filtra i ruoli in base al termine di ricerca
    const filteredRoles = roles.filter(role => role.nome.toLowerCase().startsWith(searchTerm.toLowerCase()));
  
    // Gestione del termine di ricerca
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
  
    // Gestione della selezione delle checkbox
    const handleRoleChange = (e) => {
        const { value, checked } = e.target;
        const roleId = parseInt(value, 10); // Assicurati che il valore sia un numero

        if (checked) {
            setSelectedRoles([...selectedRoles, roleId]); // Aggiunge il ruolo selezionato
        } else {
            setSelectedRoles(selectedRoles.filter(role => role !== roleId)); // Rimuove il ruolo deselezionato
        }
    };

    // Funzione per gestire la creazione della nuova sessione
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userID = sessionStorage.getItem('userID');
        const token = sessionStorage.getItem('token');
        
        try {
            if (!Array.isArray(selectedRoles) || selectedRoles.length === 0) {
                throw new Error("Ruoli selezionati deve essere un array e non può essere vuoto.");
            }

            const response = await fetch('http://localhost:8080/api/sessions/new-session/' + userID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }, 
                body: JSON.stringify({
                    ruoliSelezionati: selectedRoles 
                }),
            });

            const data = await response.json();
    
            if (response.ok) {
                // Emetti un evento WebSocket per informare della creazione della sessione
                socket.emit('sessione-creata', {
                    username: sessionStorage.getItem('username'),
                    sessionID: data.sessione[0].id,
                    selectedRoles: selectedRoles
                });
                sessionStorage.setItem('isAdmin', 'true');
                navigate(`/attesa-sessione/${data.sessione[0].id}`, {state: { selectedRoles, isAdmin: 'true', sessionID: data.sessione[0].id} })
            } else {
                throw new Error(data.message || "Couldn't create a new session");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div className={styles.loading}>loading...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div className={styles.error}>Error: {error}</div>
            </>
        );
    }

    if (roles.length === 0) {
        return (
            <>
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div className={styles.noRoles}>No roles found.</div>
            </>
        );
    }
  
    return (
        <>
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2>Seleziona i tuoi ruoli</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="roleSearch">Cerca un ruolo:</label>
                    <input
                        type="text"
                        id="roleSearch"
                        placeholder="Cerca un ruolo..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
        
                <div className={styles.formGroup}>
                    <p>Ruoli trovati:</p>
                    {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                        <div key={role.id} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`role-${role.id}`}
                                name="roles"
                                value={role.id}
                                checked={selectedRoles.includes(role.id)}
                                onChange={handleRoleChange}
                            />
                            <label htmlFor={`role-${role.id}`}>{role.nome}</label>
                        </div>
                        ))
                    ) : (
                        <p className={styles.noResults}>Nessun ruolo trovato</p>
                    )}
                </div>
                
                <button type="submit" className={styles.submitButton}>Crea la Sessione</button>
            </form>
        </>
    );
}

export default FormRuoli;