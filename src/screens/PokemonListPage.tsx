import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Pagination } from 'antd';
import { tss } from '../tss';
import { useGetPokemons, Pokemon } from 'src/hooks/useGetPokemons';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonSearchBar } from '../components/PokemonSearchBar';
import { PokemonEmptyState } from '../components/PokemonEmptyState';

const PAGE_SIZE = 20;

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const prevSearchTermRef = useRef(searchTerm);

  // Get page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // When searching, fetch all data for client-side filtering
  // When not searching, use pagination
  const hasSearch = searchTerm.trim().length > 0;
  const { data, loading, error, totalCount } = useGetPokemons(
    currentPage,
    PAGE_SIZE,
    hasSearch, // fetchAll when searching
  );

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

  // Reset to page 1 when search term changes (but not when page changes)
  useEffect(() => {
    const prevSearchTerm = prevSearchTermRef.current;
    const searchTermChanged = prevSearchTerm !== searchTerm;

    if (searchTermChanged && searchTerm.trim() && currentPage !== 1) {
      setSearchParams({ page: '1' });
    }

    prevSearchTermRef.current = searchTerm;
  }, [searchTerm, currentPage, setSearchParams]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    // Preserve pagination state in URL when navigating to detail
    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();
    const url = queryString ? `/pokemon/${pokemon.id}?${queryString}` : `/pokemon/${pokemon.id}`;
    navigate(url);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayData = hasSearch ? filteredData : data;
  const totalPages = hasSearch
    ? Math.ceil(filteredData.length / PAGE_SIZE)
    : Math.ceil(totalCount / PAGE_SIZE);
  const paginatedData = hasSearch
    ? filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : displayData;

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
      <PokemonSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Pokémon by name, number, or type..."
      />

      {displayData.length === 0 ? (
        <PokemonEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          <ul className={classes.list}>
            {paginatedData.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={handlePokemonClick} />
            ))}
          </ul>
          {totalPages > 1 && (
            <div className={classes.paginationContainer}>
              <div className={classes.paginationWrapper}>
                <div className={classes.paginationPages}>
                  <Pagination
                    current={currentPage}
                    total={hasSearch ? filteredData.length : totalCount}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    className={classes.pagination}
                  />
                </div>
                <div className={classes.paginationTotal}>
                  <Pagination
                    current={currentPage}
                    total={hasSearch ? filteredData.length : totalCount}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} Pokémon`}
                    className={classes.paginationTotalOnly}
                  />
                </div>
              </div>
            </div>
          )}
        </>
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
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    padding: '24px 0',
  },
  paginationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  paginationPages: {
    display: 'flex',
    justifyContent: 'center',
  },
  paginationTotal: {
    display: 'flex',
    justifyContent: 'center',
  },
  pagination: {
    '& .ant-pagination-item': {
      backgroundColor: '#1a1a2e',
      borderColor: '#2a2a4e',
      transition: 'all 0.2s ease',
      '& a': {
        color: theme.color.text.primary,
      },
      '&:hover': {
        backgroundColor: '#2a2a4e',
        borderColor: '#4a90e2',
        '& a': {
          color: '#4a90e2',
        },
      },
    },
    '& .ant-pagination-item-active': {
      backgroundColor: '#4a90e2',
      borderColor: '#4a90e2',
      '& a': {
        color: '#ffffff',
        fontWeight: 600,
      },
      '&:hover': {
        backgroundColor: '#5aa0f2',
        borderColor: '#5aa0f2',
      },
    },
    '& .ant-pagination-prev, & .ant-pagination-next': {
      '& .ant-pagination-item-link': {
        backgroundColor: '#1a1a2e',
        borderColor: '#2a2a4e',
        color: theme.color.text.primary,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#2a2a4e',
          borderColor: '#4a90e2',
          color: '#4a90e2',
        },
      },
      '&.ant-pagination-disabled': {
        '& .ant-pagination-item-link': {
          backgroundColor: '#0f0f1e',
          borderColor: '#1a1a2e',
          color: '#555',
          cursor: 'not-allowed',
          opacity: 0.5,
        },
      },
    },
    '& .ant-pagination-jump-prev, & .ant-pagination-jump-next': {
      '& .ant-pagination-item-link': {
        backgroundColor: '#1a1a2e',
        borderColor: '#2a2a4e',
        color: theme.color.text.primary,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#2a2a4e',
          borderColor: '#4a90e2',
          color: '#4a90e2',
        },
      },
    },
    '& .ant-pagination-item-ellipsis': {
      color: '#888',
    },
    '& .ant-pagination-total-text': {
      display: 'none',
    },
    '& .ant-pagination-options': {
      '& .ant-pagination-options-quick-jumper': {
        color: theme.color.text.primary,
        fontSize: '14px',
        '& input': {
          backgroundColor: '#1a1a2e',
          borderColor: '#2a2a4e',
          color: theme.color.text.primary,
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#4a90e2',
          },
          '&:focus': {
            borderColor: '#4a90e2',
            boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
            outline: 'none',
          },
          '&::placeholder': {
            color: '#888',
          },
        },
      },
    },
  },
  paginationTotalOnly: {
    '& .ant-pagination-item': {
      display: 'none',
    },
    '& .ant-pagination-prev, & .ant-pagination-next': {
      display: 'none',
    },
    '& .ant-pagination-jump-prev, & .ant-pagination-jump-next': {
      display: 'none',
    },
    '& .ant-pagination-options': {
      display: 'none',
    },
    '& .ant-pagination-total-text': {
      display: 'block',
      color: theme.color.text.primary,
      fontSize: '14px',
      fontWeight: 500,
    },
  },
}));
