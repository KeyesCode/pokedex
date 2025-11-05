import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Spin, Alert, Descriptions, Statistic, Row, Col } from 'antd';
import { tss } from '../tss';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';

export const PokemonDetailModal = () => {
  const { classes } = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemonDetails(id || null);

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
            <div className={classes.imageContainer}>
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

          <Descriptions
            bordered
            column={1}
            className={classes.descriptions}
            items={[
              {
                label: 'Weight',
                children: data.weight ? `${(data.weight / 10).toFixed(1)} kg` : 'N/A',
              },
              {
                label: 'Height',
                children: data.height ? `${(data.height / 10).toFixed(1)} m` : 'N/A',
              },
              {
                label: 'Capture Rate',
                children: data.captureRate !== null ? `${data.captureRate}` : 'N/A',
              },
            ]}
          />

          {data.stats.length > 0 && (
            <div className={classes.statsSection}>
              <h3 className={classes.statsTitle}>Base Stats</h3>
              <Row gutter={[16, 16]}>
                {data.stats.map((stat) => (
                  <Col xs={12} sm={8} key={stat.name}>
                    <Statistic
                      title={
                        stat.name.charAt(0).toUpperCase() + stat.name.slice(1).replace('-', ' ')
                      }
                      value={stat.baseStat}
                      className={classes.statistic}
                    />
                  </Col>
                ))}
              </Row>
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
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  content: {
    padding: '8px 0',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: '12px',
    padding: '16px',
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
    gap: '16px',
  },
  name: {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.color.text.primary,
    margin: 0,
    textTransform: 'capitalize',
  },
  number: {
    fontSize: '18px',
    color: '#888',
    fontWeight: 500,
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
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: '#2a2a4e',
    color: theme.color.text.primary,
    textTransform: 'capitalize',
  },
  descriptions: {
    marginBottom: '24px',
    '& .ant-descriptions-item-label': {
      backgroundColor: '#0f0f1e',
      color: theme.color.text.primary,
      fontWeight: 600,
    },
    '& .ant-descriptions-item-content': {
      backgroundColor: '#1a1a2e',
      color: theme.color.text.primary,
    },
  },
  statsSection: {
    marginTop: '24px',
  },
  statsTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.color.text.primary,
    marginBottom: '16px',
  },
  statistic: {
    '& .ant-statistic-title': {
      color: theme.color.text.primary,
      opacity: 0.8,
    },
    '& .ant-statistic-content': {
      color: theme.color.text.primary,
    },
  },
}));
