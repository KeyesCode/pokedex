import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Spin, Alert } from 'antd';
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
    // Preserve pagination state from URL when closing
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    const url = pageParam ? `/list?page=${pageParam}` : '/list';
    navigate(url);
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
}));
