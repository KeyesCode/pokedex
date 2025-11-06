import React from 'react';
import { tss } from '../tss';

interface PokemonInfoCardsProps {
  weight: number | null;
  height: number | null;
  captureRate: number | null;
}

export const PokemonInfoCards: React.FC<PokemonInfoCardsProps> = ({
  weight,
  height,
  captureRate,
}) => {
  const { classes } = useStyles();

  const infoItems = [
    { label: 'Weight', value: weight ? `${(weight / 10).toFixed(1)} kg` : 'N/A' },
    { label: 'Height', value: height ? `${(height / 10).toFixed(1)} m` : 'N/A' },
    { label: 'Capture Rate', value: captureRate !== null ? `${captureRate}` : 'N/A' },
  ];

  return (
    <div className={classes.infoSection}>
      <div className={classes.infoGrid}>
        {infoItems.map((item) => (
          <div key={item.label} className={classes.infoCard}>
            <div className={classes.infoLabel}>{item.label}</div>
            <div className={classes.infoValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  infoSection: {
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    '@media (max-width: 768px)': {
      gap: '8px',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '8px',
    },
  },
  infoCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    border: '1px solid #2a2a4e',
    '@media (max-width: 480px)': {
      padding: '12px',
    },
  },
  infoLabel: {
    fontSize: '11px',
    color: '#888',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  infoValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.color.text.primary,
  },
}));
