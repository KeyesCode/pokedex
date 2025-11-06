import React from 'react';
import { tss } from '../tss';

interface TypeFilterChipProps {
  type: string;
  onClose: () => void;
}

export const TypeFilterChip: React.FC<TypeFilterChipProps> = ({ type, onClose }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.filterChip}>
      <span className={classes.filterChipText}>
        Type: <span className={classes.filterChipType}>{type}</span>
      </span>
      <button
        type="button"
        className={classes.filterChipClose}
        onClick={onClose}
        aria-label={`Clear ${type} type filter`}
      >
        ×
      </button>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2a2a4e',
    border: '1px solid #4a90e2',
    borderRadius: '20px',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 500,
    color: theme.color.text.primary,
    transition: 'all 0.2s ease',
    '@media (max-width: 480px)': {
      padding: '6px 10px',
      fontSize: '12px',
    },
  },
  filterChipText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  filterChipType: {
    textTransform: 'capitalize',
    fontWeight: 600,
    color: '#4a90e2',
  },
  filterChipClose: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.color.text.primary,
    fontSize: '18px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0',
    margin: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    lineHeight: '1',
    '@media (max-width: 480px)': {
      fontSize: '16px',
      width: '18px',
      height: '18px',
    },
    '&:hover': {
      backgroundColor: '#4a90e2',
      color: '#ffffff',
      transform: 'scale(1.1)',
    },
    '&:focus': {
      outline: '2px solid #4a90e2',
      outlineOffset: '2px',
    },
  },
}));
