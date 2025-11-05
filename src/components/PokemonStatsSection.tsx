import React from 'react';
import { tss } from '../tss';

interface Stat {
  name: string;
  baseStat: number;
}

interface PokemonStatsSectionProps {
  stats: Stat[];
}

export const PokemonStatsSection: React.FC<PokemonStatsSectionProps> = ({ stats }) => {
  const { classes } = useStyles();

  if (stats.length === 0) return null;

  return (
    <div className={classes.statsSection}>
      <h3 className={classes.statsTitle}>Base Stats</h3>
      <div className={classes.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.name} className={classes.statCard}>
            <div className={classes.statLabel}>
              {stat.name.charAt(0).toUpperCase() + stat.name.slice(1).replace('-', ' ')}
            </div>
            <div className={classes.statValue}>{stat.baseStat}</div>
            <div className={classes.statBar}>
              <div
                className={classes.statBarFill}
                style={{ width: `${Math.min((stat.baseStat / 150) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  statsSection: {
    marginTop: '20px',
  },
  statsTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.color.text.primary,
    marginBottom: '16px',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #2a2a4e',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#4a90e2',
      transform: 'translateY(-2px)',
    },
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    fontWeight: 600,
    textTransform: 'capitalize',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: theme.color.text.primary,
    marginBottom: '6px',
  },
  statBar: {
    width: '100%',
    height: '5px',
    backgroundColor: '#1a1a2e',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
}));
