import React from 'react';
import { Skeleton } from 'antd';
import { tss } from '../tss';

interface PokemonListSkeletonProps {
  count?: number;
}

export const PokemonListSkeleton: React.FC<PokemonListSkeletonProps> = ({ count = 20 }) => {
  const { classes } = useStyles();

  const skeletonCards = Array.from({ length: count }, (_, i) => (
    <li key={`skeleton-${i}`} aria-hidden="true">
      <div className={classes.skeletonCard}>
        <Skeleton.Image active className={classes.skeletonImage} />
        <div className={classes.skeletonContent}>
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </div>
    </li>
  ));

  return skeletonCards;
};

const useStyles = tss.create(() => ({
  skeletonCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    border: '1px solid transparent',
    '@media (max-width: 480px)': {
      padding: '12px',
      gap: '12px',
    },
  },
  skeletonImage: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
    '@media (max-width: 480px)': {
      width: '60px',
      height: '60px',
    },
  },
  skeletonContent: {
    flex: 1,
  },
}));
