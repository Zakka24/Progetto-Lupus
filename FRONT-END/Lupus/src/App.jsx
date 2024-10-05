import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importa gli strumenti per il routing
import { WebSocketProvider } from './components/WebSocket/WebSocketProvider';  // Importa il WebSocketProvider
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login';

function App() {
  return (
    <WebSocketProvider>
      <Router>  {/* Aggiungi Router per gestire le rotte */}
        <Routes>  {/* Aggiungi Routes per definire le diverse pagine */}
          <Route path="/" element={<Homepage />} />  {/* Route per la Homepage */}
          <Route path="/login" element={<Login />} />  {/* Route per la pagina di Login */}
          {/* <Route path="/sessions" element={<Sessioni />} />  Route per la pagina di Login */}
          
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;