import React from 'react';
import { tss } from '../tss';

interface PokemonTypeBadgeProps {
  type: string;
  size: 'small' | 'medium' | 'large';
  // eslint-disable-next-line react/require-default-props
  onClick?: (type: string) => void;
}

export const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({
  type,
  size = 'medium',
  onClick,
}) => {
  const badgeSize = size;
  const { classes } = useStyles({ size: badgeSize });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    if (onClick) {
      onClick(type);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      onClick(type);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div
      className={classes.badge}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={onClick ? 0 : undefined}
    >
      {type}
    </div>
  );
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
        fontFamily: 'inherit',
        // Reset button defaults
        margin: 0,
        outline: 'none',
        '&:hover': {
          borderColor: '#4a90e2',
          backgroundColor: '#3a3a6e',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(74, 144, 226, 0.3)',
        },
        '&:focus': {
          outline: '2px solid #4a90e2',
          outlineOffset: '2px',
        },
      },
    };
  });
