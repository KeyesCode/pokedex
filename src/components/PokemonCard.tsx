import React from 'react';
import { tss } from '../tss';
import { PokemonTypeBadge } from './PokemonTypeBadge';
import { Pokemon } from 'src/hooks/useGetPokemons';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const { classes } = useStyles();

  return (
    <li>
      <button type="button" className={classes.listItem} onClick={() => onClick(pokemon)}>
        <div className={classes.imageContainer}>
          {pokemon.sprite ? (
            <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
          ) : (
            <div className={classes.imagePlaceholder}>No Image</div>
          )}
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.nameContainer}>
            <span className={classes.name}>{pokemon.name}</span>
            <span className={classes.number}>#{String(pokemon.number).padStart(3, '0')}</span>
          </div>
          <div className={classes.typesContainer}>
            {pokemon.types.map((type) => (
              <PokemonTypeBadge key={type} type={type} size="small" />
            ))}
          </div>
        </div>
      </button>
    </li>
  );
};

const useStyles = tss.create(({ theme }) => ({
  listItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    border: '1px solid transparent',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    '@media (max-width: 480px)': {
      padding: '12px',
      gap: '12px',
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      borderColor: '#4a90e2',
      backgroundColor: '#1f1f35',
    },
    '&:focus': {
      outline: '2px solid #4a90e2',
      outlineOffset: '2px',
    },
  },
  imageContainer: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '8px',
    '@media (max-width: 480px)': {
      width: '60px',
      height: '60px',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    color: theme.color.text.primary,
    fontSize: '12px',
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 600,
    color: theme.color.text.primary,
    '@media (max-width: 480px)': {
      fontSize: '16px',
    },
  },
  number: {
    fontSize: '14px',
    color: '#888',
    fontWeight: 500,
    '@media (max-width: 480px)': {
      fontSize: '12px',
    },
  },
  typesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
}));
