import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin } from 'antd';
import { tss } from '../tss';
import { useGetPokemons, Pokemon } from 'src/hooks/useGetPokemons';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonSearchBar } from '../components/PokemonSearchBar';
import { PokemonEmptyState } from '../components/PokemonEmptyState';
import { PokemonPagination } from '../components/PokemonPagination';

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
  };

  const displayData = hasSearch ? filteredData : data ?? [];
  const paginatedData = hasSearch
    ? filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : displayData;
  const paginationTotal = hasSearch ? filteredData.length : totalCount;

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
          <PokemonPagination
            currentPage={currentPage}
            total={paginationTotal}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
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
    '@media (max-width: 768px)': {
      padding: '16px',
    },
    '@media (max-width: 480px)': {
      padding: '12px',
    },
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
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '12px',
      marginBottom: '24px',
    },
    '@media (max-width: 480px)': {
      gap: '10px',
      marginBottom: '20px',
    },
  },
}));
