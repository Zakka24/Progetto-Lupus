import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './components/WebSocket/WebSocketProvider';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login';
import Sessioni from './components/Sessioni/Sessioni';
import Ruoli from './components/Ruoli/Ruoli';
import WaitPage from './components/LoadingScreen/WaitPage';
import FormRuoli from './components/Ruoli/FormRuoli';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);  // Sposta lo stato del menu qui
  
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
          <Route path="/login" element={<Login menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
          <Route path="/sessions" element={<Sessioni menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
          <Route path="/roles" element={<Ruoli menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
          <Route path="/crea-sessione" element={<FormRuoli menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
          <Route path="/attesa-sessione/:sessionID" element={<WaitPage menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
