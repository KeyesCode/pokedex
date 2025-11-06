import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons, Pokemon, GET_POKEMON_DETAILS } from 'src/hooks/useGetPokemons';
import { useDebouncedValue } from 'src/hooks/useDebouncedValue';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonSearchBar } from '../components/PokemonSearchBar';
import { PokemonEmptyState } from '../components/PokemonEmptyState';
import { PokemonPagination } from '../components/PokemonPagination';
import { PokemonListSkeleton } from '../components/PokemonListSkeleton';
import { TypeFilterChip } from '../components/TypeFilterChip';
import { useApolloClient } from '@apollo/client/react';

const PAGE_SIZE = 20;

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const client = useApolloClient();

  // Get page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Get type filter from URL
  const typeFilter = searchParams.get('type') || '';

  // Initialize input from URL once on mount
  const initial = searchParams.get('search') ?? '';
  const [inputValue, setInputValue] = useState(initial);
  const debouncedSearch = useDebouncedValue(inputValue, 250);

  // Sync URL only when debounced changes (reduces history spam)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const prevSearch = params.get('search') ?? '';

    if (debouncedSearch.trim()) {
      const needsSearchUpdate = prevSearch !== debouncedSearch;

      if (!needsSearchUpdate) return;

      params.set('search', debouncedSearch);
      // Only reset page to 1 when search term actually changes
      params.set('page', '1');
    } else {
      if (!prevSearch) return; // nothing to remove
      params.delete('search');
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  // When searching or filtering by type, fetch all data for client-side filtering
  // When not searching/filtering, use pagination
  const hasSearch = debouncedSearch.trim().length > 0;
  const hasTypeFilter = typeFilter.length > 0;
  const needsAllData = hasSearch || hasTypeFilter;
  const { data, loading, error, totalCount } = useGetPokemons(
    currentPage,
    PAGE_SIZE,
    needsAllData, // fetchAll when searching or filtering by type
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    let result = data;

    // Filter by type if type filter is set
    if (typeFilter) {
      result = result.filter((pokemon) =>
        pokemon.types.some((type) => type.toLowerCase() === typeFilter.toLowerCase()),
      );
    }

    // Filter by search term if search is set
    if (debouncedSearch.trim()) {
      const s = debouncedSearch.toLowerCase();
      result = result.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(s) ||
          pokemon.number.toString().includes(debouncedSearch) ||
          pokemon.types.some((type) => type.toLowerCase().includes(s)),
      );
    }

    return result;
  }, [data, debouncedSearch, typeFilter]);

  const handlePokemonClick = useCallback(
    (pokemon: Pokemon) => {
      // Preserve pagination state in URL when navigating to detail
      const params = new URLSearchParams(searchParams);
      const queryString = params.toString();
      const url = queryString ? `/pokemon/${pokemon.id}?${queryString}` : `/pokemon/${pokemon.id}`;
      navigate(url);
    },
    [navigate, searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Input handler is now trivial
  const onSearchChange = useCallback((value: string) => setInputValue(value), []);

  // Handle type badge click to filter by type
  const handleTypeClick = useCallback(
    (type: string) => {
      const params = new URLSearchParams(searchParams);
      if ((searchParams.get('type') || '').toLowerCase() === type.toLowerCase()) {
        params.delete('type');
      } else {
        params.set('type', type.toLowerCase());
      }
      params.set('page', '1');
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Prefetch on hover: no optional chain needed
  const handlePokemonHover = useCallback(
    (pokemon: Pokemon) => {
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
    },
    [client],
  );

  const handleClearTypeFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('type');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const displayData = needsAllData ? filteredData : data ?? [];
  const paginatedData = needsAllData
    ? filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : displayData;
  // Use totalCount as fallback during loading to keep pagination visible
  let paginationTotal: number;
  if (needsAllData) {
    // When searching/filtering, use filtered length, but fallback to totalCount during loading
    paginationTotal = loading && filteredData.length === 0 ? totalCount : filteredData.length;
  } else {
    // Normal pagination always uses totalCount
    paginationTotal = totalCount;
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
      <div className={classes.searchSection}>
        <PokemonSearchBar
          value={inputValue}
          onChange={onSearchChange}
          placeholder="Search Pokémon by name, number, or type..."
        />
        {typeFilter && <TypeFilterChip type={typeFilter} onClose={handleClearTypeFilter} />}
      </div>

      {loading && (
        <ul className={classes.list}>
          <PokemonListSkeleton count={PAGE_SIZE} />
        </ul>
      )}
      {!loading && displayData.length === 0 && (
        <PokemonEmptyState searchTerm={typeFilter ? `type: ${typeFilter}` : debouncedSearch} />
      )}
      {!loading && displayData.length > 0 && (
        <ul className={classes.list}>
          {paginatedData.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={handlePokemonClick}
              onMouseEnter={() => handlePokemonHover(pokemon)}
              onFocus={() => handlePokemonHover(pokemon)}
              onTypeClick={handleTypeClick}
            />
          ))}
        </ul>
      )}
      {paginationTotal > 0 && (
        <PokemonPagination
          currentPage={currentPage}
          total={paginationTotal}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
        />
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
  searchSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      marginBottom: '20px',
      gap: '10px',
    },
    '@media (max-width: 480px)': {
      marginBottom: '16px',
      gap: '8px',
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
