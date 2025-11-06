import React from 'react';
import { tss } from '../tss';

interface PokemonTypeBadgeProps {
  type: string;
  size: 'small' | 'medium' | 'large';
}

export const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({ type, size = 'medium' }) => {
  const badgeSize = size;
  const { classes } = useStyles({ size: badgeSize });

  return <span className={classes.badge}>{type}</span>;
};

const useStyles = tss
  .withParams<{ size: 'small' | 'medium' | 'large' }>()
  .create(({ theme, size }) => {
    const paddingMap: Record<'small' | 'medium' | 'large', string> = {
      small: '4px 12px',
      medium: '6px 16px',
      large: '8px 20px',
    };
    const borderRadiusMap: Record<'small' | 'medium' | 'large', string> = {
      small: '16px',
      medium: '20px',
      large: '24px',
    };
    const fontSizeMap: Record<'small' | 'medium' | 'large', string> = {
      small: '12px',
      medium: '13px',
      large: '14px',
    };

    return {
      badge: {
        padding: paddingMap[size],
        borderRadius: borderRadiusMap[size],
        fontSize: fontSizeMap[size],
        fontWeight: 600,
        backgroundColor: '#2a2a4e',
        color: theme.color.text.primary,
        textTransform: 'capitalize',
        border: '1px solid #3a3a5e',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'inline-block',
        '&:hover': {
          borderColor: '#4a90e2',
          backgroundColor: '#3a3a6e',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(74, 144, 226, 0.3)',
        },
      },
    };
  });
