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
        <div className={classes.skeletonImageContainer}>
          <Skeleton.Image active className={classes.skeletonImage} />
        </div>
        <div className={classes.skeletonInfoContainer}>
          <Skeleton.Input active size="default" className={classes.skeletonName} />
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
    height: '114px',
    overflow: 'hidden',
    '@media (max-width: 480px)': {
      padding: '12px',
      gap: '12px',
      height: '86px',
    },
  },
  skeletonImageContainer: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '8px',
    overflow: 'hidden',
    '@media (max-width: 480px)': {
      width: '60px',
      height: '60px',
    },
  },
  skeletonImage: {
    width: '80px !important',
    height: '80px !important',
    minWidth: '80px !important',
    minHeight: '80px !important',
    maxWidth: '80px !important',
    maxHeight: '80px !important',
    '@media (max-width: 480px)': {
      width: '60px !important',
      height: '60px !important',
      minWidth: '60px !important',
      minHeight: '60px !important',
      maxWidth: '60px !important',
      maxHeight: '60px !important',
    },
  },
  skeletonInfoContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    overflow: 'hidden',
  },
  skeletonName: {
    width: '120px',
    height: '18px',
    maxWidth: '100%',
  },
}));
