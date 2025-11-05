import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Spin, Alert } from 'antd';
import { tss } from '../tss';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';

export const PokemonDetailModal = () => {
  const { classes } = useStyles();
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Extract id from URL pathname if not available from params (for /list route)
  const pokemonIdMatch = location.pathname.match(/\/pokemon\/(\d+)/);
  const id = paramId || pokemonIdMatch?.[1] || null;

  const { data, loading, error } = useGetPokemonDetails(id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * -35; // Max 35 degrees
    const rotateY = (mouseX / rect.width) * 35; // Max 35 degrees

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  const handleClose = () => {
    navigate('/list');
  };

  return (
    <Modal
      open={!!id}
      onCancel={handleClose}
      footer={null}
      width={800}
      className={classes.modal}
      styles={{
        body: {
          backgroundColor: '#1a1a2e',
          color: '#FAFAFA',
          maxHeight: '90vh',
          overflowY: 'auto',
        },
        header: {
          backgroundColor: '#1a1a2e',
          borderBottom: '1px solid #2a2a4e',
        },
      }}
    >
      {loading && (
        <div className={classes.loadingContainer}>
          <Spin size="large" />
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description={`Failed to load Pokémon details: ${error.message}`}
          type="error"
          showIcon
        />
      )}

      {!loading && !error && data && (
        <div className={classes.content}>
          <div className={classes.header}>
            <div
              ref={imageContainerRef}
              className={classes.imageContainer}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={tiltStyle}
            >
              {data.sprite ? (
                <img src={data.sprite} alt={data.name} className={classes.image} />
              ) : (
                <div className={classes.imagePlaceholder}>No Image</div>
              )}
            </div>
            <div className={classes.titleContainer}>
              <h2 className={classes.name}>{data.name}</h2>
              <span className={classes.number}>#{String(data.number).padStart(3, '0')}</span>
            </div>
            <div className={classes.typesContainer}>
              {data.types.map((type) => (
                <span key={type} className={classes.typeBadge}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className={classes.infoSection}>
            <div className={classes.infoGrid}>
              <div className={classes.infoCard}>
                <div className={classes.infoLabel}>Weight</div>
                <div className={classes.infoValue}>
                  {data.weight ? `${(data.weight / 10).toFixed(1)} kg` : 'N/A'}
                </div>
              </div>
              <div className={classes.infoCard}>
                <div className={classes.infoLabel}>Height</div>
                <div className={classes.infoValue}>
                  {data.height ? `${(data.height / 10).toFixed(1)} m` : 'N/A'}
                </div>
              </div>
              <div className={classes.infoCard}>
                <div className={classes.infoLabel}>Capture Rate</div>
                <div className={classes.infoValue}>
                  {data.captureRate !== null ? `${data.captureRate}` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {data.stats.length > 0 && (
            <div className={classes.statsSection}>
              <h3 className={classes.statsTitle}>Base Stats</h3>
              <div className={classes.statsGrid}>
                {data.stats.map((stat) => (
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
          )}
        </div>
      )}
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  modal: {
    '& .ant-modal-content': {
      backgroundColor: '#1a1a2e',
      color: theme.color.text.primary,
    },
    '& .ant-modal-close': {
      backgroundColor: '#2a2a4e',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '16px',
      right: '16px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#4a90e2',
        transform: 'scale(1.1)',
      },
      '& .ant-modal-close-x': {
        width: '32px',
        height: '32px',
        lineHeight: '32px',
        color: '#FAFAFA',
        fontSize: '16px',
        fontWeight: 600,
      },
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  content: {
    padding: '4px 0',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
  },
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
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.color.text.primary,
    margin: 0,
    textTransform: 'capitalize',
    letterSpacing: '0.5px',
  },
  number: {
    fontSize: '18px',
    color: '#888',
    fontWeight: 600,
  },
  typesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
    backgroundColor: '#2a2a4e',
    color: theme.color.text.primary,
    textTransform: 'capitalize',
    border: '1px solid #3a3a5e',
  },
  infoSection: {
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  infoCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    border: '1px solid #2a2a4e',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#4a90e2',
      transform: 'translateY(-2px)',
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
