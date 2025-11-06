import React, { useState, useRef } from 'react';
import { tss } from '../tss';

interface PokemonImageProps {
  sprite: string | null;
  name: string;
  enableTilt: boolean;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({ sprite, name, enableTilt = false }) => {
  const shouldTilt = enableTilt;
  const { classes } = useStyles();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldTilt || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * -35;
    const rotateY = (mouseX / rect.width) * 35;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    });
  };

  const handleMouseLeave = () => {
    if (!shouldTilt) return;
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  return (
    <div
      ref={shouldTilt ? imageContainerRef : null}
      className={classes.imageContainer}
      onMouseMove={shouldTilt ? handleMouseMove : undefined}
      onMouseLeave={shouldTilt ? handleMouseLeave : undefined}
      style={shouldTilt ? tiltStyle : undefined}
    >
      {sprite ? (
        <img
          src={sprite}
          alt={name}
          className={classes.image}
          loading="lazy"
          width={180}
          height={180}
        />
      ) : (
        <div className={classes.imagePlaceholder}>No Image</div>
      )}
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  imageContainer: {
    width: '180px',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s ease-out',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      width: '150px',
      height: '150px',
      padding: '12px',
    },
    '@media (max-width: 480px)': {
      width: '120px',
      height: '120px',
      padding: '10px',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    color: theme.color.text.primary,
    fontSize: '14px',
    opacity: 0.5,
  },
}));
