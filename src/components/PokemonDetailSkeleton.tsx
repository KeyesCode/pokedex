import React from 'react';
import { Skeleton } from 'antd';
import { tss } from '../tss';

export const PokemonDetailSkeleton: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <Skeleton.Image active className={classes.skeletonImage} />
        <div className={classes.skeletonHeader}>
          <Skeleton.Input active size="large" className={classes.skeletonName} />
          <Skeleton.Input active size="small" className={classes.skeletonNumber} />
        </div>
        <div className={classes.skeletonTypes}>
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
        </div>
      </div>

      <div className={classes.skeletonInfoSection}>
        <div className={classes.infoGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={classes.infoCard}>
              <Skeleton.Input active size="small" className={classes.skeletonInfoLabel} />
              <Skeleton.Input active size="large" className={classes.skeletonInfoValue} />
            </div>
          ))}
        </div>
      </div>

      <div className={classes.skeletonStatsSection}>
        <Skeleton.Input active size="large" className={classes.skeletonStatsTitle} />
        <div className={classes.statsGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={classes.statCard}>
              <Skeleton.Input active size="small" className={classes.skeletonStatLabel} />
              <Skeleton.Input active size="default" className={classes.skeletonStatValue} />
              <Skeleton.Button active size="small" className={classes.skeletonStatBar} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const useStyles = tss.create(() => ({
  content: {
    padding: '4px 0',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    '@media (max-width: 480px)': {
      marginBottom: '16px',
      gap: '8px',
    },
  },
  skeletonImage: {
    width: '180px',
    height: '180px',
    '@media (max-width: 768px)': {
      width: '150px',
      height: '150px',
    },
    '@media (max-width: 480px)': {
      width: '120px',
      height: '120px',
    },
  },
  skeletonHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  skeletonName: {
    width: '200px',
    height: '32px',
  },
  skeletonNumber: {
    width: '60px',
    height: '24px',
  },
  skeletonTypes: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  skeletonInfoSection: {
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
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
  skeletonInfoLabel: {
    width: '60%',
    height: '12px',
    marginBottom: '8px',
    margin: '0 auto 8px',
  },
  skeletonInfoValue: {
    width: '80%',
    height: '24px',
    margin: '0 auto',
  },
  skeletonStatsSection: {
    marginTop: '20px',
  },
  skeletonStatsTitle: {
    width: '150px',
    height: '24px',
    margin: '0 auto 16px',
    display: 'block',
    '@media (max-width: 480px)': {
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
  },
  skeletonStatLabel: {
    width: '70%',
    height: '14px',
    marginBottom: '8px',
  },
  skeletonStatValue: {
    width: '40px',
    height: '28px',
    marginBottom: '8px',
  },
  skeletonStatBar: {
    width: '100%',
    height: '5px',
    marginTop: '4px',
  },
}));
