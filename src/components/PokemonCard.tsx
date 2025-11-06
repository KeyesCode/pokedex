import React, { useState, useRef } from 'react';
import { tss } from '../tss';
import { PokemonTypeBadge } from './PokemonTypeBadge';
import { Pokemon } from 'src/hooks/useGetPokemons';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
  // eslint-disable-next-line react/require-default-props
  onMouseEnter?: () => void;
  // eslint-disable-next-line react/require-default-props
  onFocus?: () => void;
  // eslint-disable-next-line react/require-default-props
  onTypeClick?: (type: string) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onClick,
  onMouseEnter = () => {},
  onFocus = () => {},
  onTypeClick,
}) => {
  const { classes } = useStyles();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Respect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldTilt = !prefersReducedMotion;

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldTilt || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * -20;
    const rotateY = (mouseX / rect.width) * 20;

    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    });
  };

  const handleImageMouseLeave = () => {
    if (!shouldTilt) return;
    setTiltStyle({
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(pokemon);
    }
  };

  return (
    <li>
      <button
        type="button"
        className={classes.listItem}
        aria-label={`View details for ${pokemon.name}`}
        onClick={() => onClick(pokemon)}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          ref={shouldTilt ? imageContainerRef : null}
          className={classes.imageContainer}
          onMouseMove={shouldTilt ? handleImageMouseMove : undefined}
          onMouseLeave={shouldTilt ? handleImageMouseLeave : undefined}
          style={shouldTilt ? tiltStyle : undefined}
          aria-hidden={shouldTilt ? 'true' : undefined}
        >
          {pokemon.sprite ? (
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className={classes.image}
              loading="lazy"
              width={80}
              height={80}
            />
          ) : (
            <div className={classes.imagePlaceholder}>No Image</div>
          )}
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.nameContainer}>
            <span className={classes.name}>{pokemon.name}</span>
            <span className={classes.number}>#{String(pokemon.number).padStart(3, '0')}</span>
          </div>
          <div className={classes.typesContainer}>
            {pokemon.types.map((type) => (
              <PokemonTypeBadge key={type} type={type} size="small" onClick={onTypeClick} />
            ))}
          </div>
        </div>
      </button>
    </li>
  );
};

const useStyles = tss.create(({ theme }) => ({
  listItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    border: '1px solid transparent',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    '@media (max-width: 480px)': {
      padding: '12px',
      gap: '12px',
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      borderColor: '#4a90e2',
      backgroundColor: '#1f1f35',
    },
    '&:focus': {
      outline: '2px solid #4a90e2',
      outlineOffset: '2px',
    },
  },
  imageContainer: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '8px',
    transition: 'transform 0.1s ease-out',
    '@media (max-width: 480px)': {
      width: '60px',
      height: '60px',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    color: theme.color.text.primary,
    fontSize: '12px',
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    fontSize: '18px',
    fontWeight: 600,
    color: theme.color.text.primary,
    '@media (max-width: 480px)': {
      fontSize: '16px',
    },
  },
  number: {
    fontSize: '14px',
    color: '#888',
    fontWeight: 500,
    '@media (max-width: 480px)': {
      fontSize: '12px',
    },
  },
  typesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
}));
