import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { tss } from '../tss';
import { useGetPokemons, Pokemon } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemons();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchLower) ||
        pokemon.number.toString().includes(searchTerm) ||
        pokemon.types.some((type) => type.toLowerCase().includes(searchLower)),
    );
  }, [data, searchTerm]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <div className={classes.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.root}>
        <div className={classes.errorContainer}>
          <p>Error loading Pokémon: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <Input
          placeholder="Search Pokémon by name, number, or type..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          className={classes.searchInput}
        />
      </div>

      {filteredData.length === 0 ? (
        <div className={classes.emptyContainer}>
          <Empty description="No Pokémon found" />
        </div>
      ) : (
        <ul className={classes.list}>
          {filteredData.map((pokemon) => (
            <li key={pokemon.id}>
              <button
                type="button"
                className={classes.listItem}
                onClick={() => handlePokemonClick(pokemon)}
              >
                <div className={classes.imageContainer}>
                  {pokemon.sprite ? (
                    <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
                  ) : (
                    <div className={classes.imagePlaceholder}>No Image</div>
                  )}
                </div>
                <div className={classes.infoContainer}>
                  <div className={classes.nameContainer}>
                    <span className={classes.name}>{pokemon.name}</span>
                    <span className={classes.number}>
                      #{String(pokemon.number).padStart(3, '0')}
                    </span>
                  </div>
                  <div className={classes.typesContainer}>
                    {pokemon.types.map((type) => (
                      <span key={type} className={classes.typeBadge}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '24px',
    minHeight: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#ff4d4f',
  },
  searchContainer: {
    marginBottom: '24px',
    maxWidth: '500px',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    color: '#000000',
    transition: 'all 0.2s ease',
    border: '1px solid #d9d9d9',
    '& input': {
      backgroundColor: '#ffffff',
      color: '#000000',
      transition: 'all 0.2s ease',
    },
    '& .ant-input-prefix': {
      color: '#000000',
    },
    '&:focus-within': {
      borderColor: '#4a90e2',
      boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
    },
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
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
  },
  number: {
    fontSize: '14px',
    color: '#888',
    fontWeight: 500,
  },
  typesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  typeBadge: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#2a2a4e',
    color: theme.color.text.primary,
    textTransform: 'capitalize',
  },
}));
