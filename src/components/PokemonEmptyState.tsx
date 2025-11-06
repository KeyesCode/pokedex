import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { tss } from '../tss';

interface PokemonEmptyStateProps {
  searchTerm: string;
  onClear?: () => void;
}

export const PokemonEmptyState: React.FC<PokemonEmptyStateProps> = ({
  searchTerm = '',
  onClear,
}) => {
  const { classes } = useStyles();
  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <div className={classes.emptyContainer} role="status" aria-live="polite">
      <div className={classes.emptyContent}>
        <div className={classes.emptyIcon}>
          <SearchOutlined />
        </div>
        <h3 className={classes.emptyTitle}>
          {hasSearchTerm ? 'No Pokémon Found' : 'No Pokémon Available'}
        </h3>
        <p className={classes.emptyDescription}>
          {hasSearchTerm ? (
            <>
              No Pokémon found matching{' '}
              <span className={classes.searchTerm}>&quot;{searchTerm}&quot;</span>
              <br />
              Try searching by name, number, or type
            </>
          ) : (
            'Start searching to find Pokémon!'
          )}
        </p>
        {hasSearchTerm && onClear && (
          <button type="button" onClick={onClear} className={classes.clearButton}>
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '500px',
    padding: '40px 20px',
  },
  emptyContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  emptyIcon: {
    width: '120px',
    height: '120px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '50%',
    border: '2px solid #2a2a4e',
    fontSize: '48px',
    color: '#4a90e2',
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: theme.color.text.primary,
    margin: '0 0 12px',
    letterSpacing: '0.5px',
  },
  emptyDescription: {
    fontSize: '16px',
    color: '#888',
    lineHeight: '1.6',
    margin: 0,
  },
  searchTerm: {
    color: '#4a90e2',
    fontWeight: 600,
  },
  clearButton: {
    marginTop: '16px',
    padding: '8px 16px',
    backgroundColor: '#4a90e2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#5aa0f2',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      outline: '2px solid #4a90e2',
      outlineOffset: '2px',
    },
  },
}));
