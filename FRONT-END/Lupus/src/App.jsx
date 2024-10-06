import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importa gli strumenti per il routing
import { WebSocketProvider } from './components/WebSocket/WebSocketProvider';  // Importa il WebSocketProvider
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login';
import Sessioni from './components/Sessioni/Sessioni';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />  {/* Route per la Homepage */}
          <Route path="/login" element={<Login />} />  {/* Route per la pagina di Login */}
          <Route path="/sessions" element={<Sessioni />} />  {/* Route per la pagina di Login */}
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;