import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons, Pokemon, GET_POKEMON_DETAILS } from 'src/hooks/useGetPokemons';
import { useDebouncedValue } from 'src/hooks/useDebouncedValue';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonSearchBar } from '../components/PokemonSearchBar';
import { PokemonEmptyState } from '../components/PokemonEmptyState';
import { PokemonPagination } from '../components/PokemonPagination';
import { PokemonListSkeleton } from '../components/PokemonListSkeleton';
import { useApolloClient } from '@apollo/client/react';

const PAGE_SIZE = 20;

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const client = useApolloClient();

  // Get page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Initialize input from URL once on mount
  const initial = searchParams.get('search') ?? '';
  const [inputValue, setInputValue] = useState(initial);
  const debouncedSearch = useDebouncedValue(inputValue, 250);

  // Sync URL only when debounced changes (reduces history spam)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
      if (params.get('page') !== '1') params.set('page', '1');
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // When searching, fetch all data for client-side filtering
  // When not searching, use pagination
  const hasSearch = debouncedSearch.trim().length > 0;
  const { data, loading, error, totalCount } = useGetPokemons(
    currentPage,
    PAGE_SIZE,
    hasSearch, // fetchAll when searching
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearch.trim()) return data;

    const s = debouncedSearch.toLowerCase();
    return data.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(s) ||
        pokemon.number.toString().includes(debouncedSearch) ||
        pokemon.types.some((type) => type.toLowerCase().includes(s)),
    );
  }, [data, debouncedSearch]);

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
    setSearchParams(params, { replace: true });
  };

  // Input handler is now trivial
  const onSearchChange = (value: string) => setInputValue(value);

  // Prefetch on hover: no optional chain needed
  const handlePokemonHover = (pokemon: Pokemon) => {
    const idInt = parseInt(pokemon.id, 10);
    if (!Number.isNaN(idInt)) {
      client
        .query({
          query: GET_POKEMON_DETAILS,
          variables: { id: idInt },
        })
        .catch(() => {
          // Silently fail - prefetch is optional
        });
    }
  };

  const displayData = hasSearch ? filteredData : data ?? [];
  const paginatedData = hasSearch
    ? filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : displayData;
  const paginationTotal = hasSearch ? filteredData.length : totalCount;

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
        value={inputValue}
        onChange={onSearchChange}
        placeholder="Search Pokémon by name, number, or type..."
      />

      {loading && (
        <ul className={classes.list}>
          <PokemonListSkeleton count={PAGE_SIZE} />
        </ul>
      )}
      {!loading && displayData.length === 0 && <PokemonEmptyState searchTerm={debouncedSearch} />}
      {!loading && displayData.length > 0 && (
        <>
          <ul className={classes.list}>
            {paginatedData.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handlePokemonClick}
                onMouseEnter={() => handlePokemonHover(pokemon)}
                onFocus={() => handlePokemonHover(pokemon)}
              />
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
