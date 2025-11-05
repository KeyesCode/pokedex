import React from 'react';
import { tss } from '../tss';
import { PokemonTypeBadge } from './PokemonTypeBadge';

interface PokemonHeaderProps {
  name: string;
  number: number;
  types: string[];
}

export const PokemonHeader: React.FC<PokemonHeaderProps> = ({ name, number, types }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.header}>
      <div className={classes.titleContainer}>
        <h2 className={classes.name}>{name}</h2>
        <span className={classes.number}>#{String(number).padStart(3, '0')}</span>
      </div>
      <div className={classes.typesContainer}>
        {types.map((type) => (
          <PokemonTypeBadge key={type} type={type} size="medium" />
        ))}
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.color.text.primary,
    margin: 0,
    textTransform: 'capitalize',
    letterSpacing: '0.5px',
    '@media (max-width: 768px)': {
      fontSize: '24px',
    },
    '@media (max-width: 480px)': {
      fontSize: '20px',
    },
  },
  number: {
    fontSize: '18px',
    color: '#888',
    fontWeight: 600,
    '@media (max-width: 768px)': {
      fontSize: '16px',
    },
    '@media (max-width: 480px)': {
      fontSize: '14px',
    },
  },
  typesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));
