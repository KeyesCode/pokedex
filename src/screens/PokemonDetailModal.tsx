import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Alert, Skeleton } from 'antd';
import { tss } from '../tss';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { PokemonImage } from '../components/PokemonImage';
import { PokemonHeader } from '../components/PokemonHeader';
import { PokemonInfoCards } from '../components/PokemonInfoCards';
import { PokemonStatsSection } from '../components/PokemonStatsSection';

export const PokemonDetailModal = () => {
  const { classes } = useStyles();
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract id from URL pathname if not available from params (for /list route)
  const pokemonIdMatch = location.pathname.match(/\/pokemon\/(\d+)/);
  const id = paramId || pokemonIdMatch?.[1] || null;

  const { data, loading, error } = useGetPokemonDetails(id);

  const handleClose = () => {
    // Preserve pagination and search state from URL when closing
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    const searchParam = searchParams.get('search');
    const params: string[] = [];
    if (pageParam) params.push(`page=${pageParam}`);
    if (searchParam) params.push(`search=${searchParam}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    navigate(`/list${queryString}`, { replace: true });
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
      )}

      {error && (
        <Alert
          message="Error"
          description={`Failed to load Pokémon details: ${error.message}`}
          type="error"
          showIcon
        />
      )}

      {!loading && !error && !data && (
        <Alert
          message="Pokémon Not Found"
          description="The Pokémon you're looking for doesn't exist or the ID is invalid."
          type="warning"
          showIcon
        />
      )}

      {!loading && !error && data && (
        <div className={classes.content}>
          <div className={classes.header}>
            <PokemonImage sprite={data.sprite} name={data.name} enableTilt />
            <PokemonHeader name={data.name} number={data.number} types={data.types} />
          </div>

          <PokemonInfoCards
            weight={data.weight}
            height={data.height}
            captureRate={data.captureRate}
          />

          <PokemonStatsSection stats={data.stats} />
        </div>
      )}
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  modal: {
    '& .ant-modal': {
      '@media (max-width: 768px)': {
        maxWidth: '95vw !important',
        margin: '10px auto !important',
      },
      '@media (max-width: 480px)': {
        maxWidth: '100vw !important',
        margin: '0 !important',
        top: '0 !important',
        paddingBottom: '0 !important',
      },
    },
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
      '@media (max-width: 480px)': {
        top: '12px',
        right: '12px',
        width: '28px',
        height: '28px',
      },
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
        '@media (max-width: 480px)': {
          width: '28px',
          height: '28px',
          lineHeight: '28px',
          fontSize: '14px',
        },
      },
    },
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
