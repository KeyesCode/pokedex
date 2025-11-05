import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { tss } from '../tss';
import { useGetPokemons, Pokemon } from 'src/hooks/useGetPokemons';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonSearchBar } from '../components/PokemonSearchBar';
import { PokemonEmptyState } from '../components/PokemonEmptyState';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemons();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchLower) ||
        pokemon.number.toString().includes(searchTerm) ||
        pokemon.types.some((type) => type.toLowerCase().includes(searchLower)),
    );
  }, [data, searchTerm]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <div className={classes.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.root}>
        <div className={classes.errorContainer}>
          <p>Error loading Pokémon: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <PokemonSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Pokémon by name, number, or type..."
      />

      {filteredData.length === 0 ? (
        <PokemonEmptyState searchTerm={searchTerm} />
      ) : (
        <ul className={classes.list}>
          {filteredData.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={handlePokemonClick} />
          ))}
        </ul>
      )}
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '24px',
    minHeight: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#ff4d4f',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
}));
