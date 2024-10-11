import React from 'react';
import Header from "../Header/Header";
import Descrizione from "../Descrizione/Descrizione";

function Homepage({ menuOpen, setMenuOpen }) {
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Descrizione />
    </>
  );
}

export default Homepage;
