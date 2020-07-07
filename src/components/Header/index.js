import React from 'react';

import './style.css';

export default function Header() {
  return (
    <header id="headerUp">
      <h4>Pokestore</h4>
      <div>
        <input 
          type="text" 
          id="inputQueryPokemon" 
          name="inputQueryPokemon"
          value="Pesquise aqui"
        />
        <input 
          type="submit" 
          id="buttonSubmitQueryPokemon" 
          name="buttonSubmitQueryPokemon"
          value="Pesquisar"
        />
      </div>
    </header>
  );
}