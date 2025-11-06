import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons, Pokemon, GET_POKEMON_DETAILS } from 'src/hooks/useGetPokemons';
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

  // Get search from URL, default to empty
  const search = searchParams.get('search') ?? '';
  const [searchTerm, setSearchTerm] = useState(search);
  const [inputValue, setInputValue] = useState(search); // Local state for immediate input feedback
  const debounced = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Keep URL in sync with search term (and avoid history bloat)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
      // Only reset page to 1 if search term actually changed (not just on any params change)
      if (params.get('page') !== '1') params.set('page', '1');
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Initialize searchTerm and inputValue from URL on mount
  useEffect(() => {
    if (search !== searchTerm) {
      setSearchTerm(search);
      setInputValue(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Cleanup debounce timeout on unmount
  useEffect(
    () => () => {
      if (debounced.current) {
        clearTimeout(debounced.current);
      }
    },
    [],
  );

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

  const onSearchChange = (value: string) => {
    setInputValue(value); // Update input immediately for responsive UI
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => setSearchTerm(value), 250);
  };

  const handlePokemonHover = (pokemon: Pokemon) => {
    // Prefetch Pokemon details on hover
    const idInt = parseInt(pokemon.id, 10);
    if (!Number.isNaN(idInt) && client?.query) {
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
      {!loading && displayData.length === 0 && <PokemonEmptyState searchTerm={searchTerm} />}
      {!loading && displayData.length > 0 && (
        <>
          <ul className={classes.list}>
            {paginatedData.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handlePokemonClick}
                onMouseEnter={() => handlePokemonHover(pokemon)}
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
