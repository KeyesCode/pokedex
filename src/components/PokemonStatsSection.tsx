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

  // Derive max stat from data for dynamic scaling
  const maxStat = Math.max(...stats.map((s) => s.baseStat), 150);

  return (
    <div className={classes.statsSection}>
      <h3 className={classes.statsTitle}>Base Stats</h3>
      <div className={classes.statsGrid}>
        {stats.map((stat) => {
          const percentage = Math.min((stat.baseStat / maxStat) * 100, 100);
          return (
            <div key={stat.name} className={classes.statCard}>
              <div className={classes.statLabel}>
                {stat.name.charAt(0).toUpperCase() + stat.name.slice(1).replace('-', ' ')}
              </div>
              <div className={classes.statValue}>{stat.baseStat}</div>
              <div
                className={classes.statBar}
                role="progressbar"
                aria-valuenow={stat.baseStat}
                aria-valuemin={0}
                aria-valuemax={maxStat}
                aria-label={`${stat.name} stat: ${stat.baseStat} out of ${maxStat}`}
              >
                <div className={classes.statBarFill} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
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
    '@media (max-width: 480px)': {
      fontSize: '18px',
      marginBottom: '12px',
    },
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '10px',
    },
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
