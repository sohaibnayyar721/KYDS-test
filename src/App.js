import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPokemonList = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setPokemonList(data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching Pokémon list');
    }
  };

  const fetchPokemonDetails = async (pokemonUrl) => {
    try {
      setLoading(true);
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      setCurrentPokemon(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching Pokémon details');
    }
  };

  const fetchPokemonAttacks = async () => {
    if (!currentPokemon) return; 
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon.id}`);
      const data = await response.json();
      setAttacks(data.moves);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching Pokémon attacks');
    }
  };

  useEffect(() => {
    fetchPokemonList('https://pokeapi.co/api/v2/pokemon');
  }, []);

  return (
    <div className="App">
      <h1>Pokémon List</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {pokemonList.map(pokemon => (
            <li key={pokemon.name}>
              <button onClick={() => fetchPokemonDetails(pokemon.url)}>
                {pokemon.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {currentPokemon && (
        <div>
          <h2>{currentPokemon.name}</h2>
          <p>Types: {currentPokemon.types.map(type => type.type.name).join(', ')}</p>
          <p>Height: {currentPokemon.height}</p>
          <p>Number of Attacks: {currentPokemon.moves.length}</p>
          <button onClick={fetchPokemonAttacks}>Show Attacks</button>
          {attacks.length > 0 && (
            <ul>
              {attacks.map(attack => (
                <li key={attack.move.name}>
                  {attack.move.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
