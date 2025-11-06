import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  number: number;
  types: string[];
  sprite: string | null;
}

export interface PokemonDetail extends Pokemon {
  weight: number | null;
  height: number | null;
  captureRate: number | null;
  stats: Array<{ name: string; baseStat: number }>;
}

// For server-side search (senior level), add $search: String parameter and use it in a where clause:
// query GetPokemons($limit: Int, $offset: Int, $search: String)
export const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

export const useGetPokemons = (
  page: number = 1,
  pageSize: number = 20,
  fetchAll: boolean = false,
): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
  totalCount: number;
} => {
  const limit = fetchAll ? 160 : pageSize;
  const offset = fetchAll ? 0 : (page - 1) * pageSize;

  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: { limit, offset },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name || '',
          number: parseInt(p.id, 10),
          types:
            p.pokemontypes?.map((pt: any) => pt.type.typenames?.[0]?.name).filter(Boolean) || [],
          sprite: p.pokemonsprites?.[0]?.sprites || null,
        }),
      ) ?? [],
    loading,
    error,
    totalCount: 160, // Total number of Pokémon
  };
};

export const useGetPokemonDetails = (
  id: string | null,
): {
  data: PokemonDetail | null;
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const idInt = id ? parseInt(id, 10) : null;
  const isValidId = idInt !== null && !Number.isNaN(idInt);
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id: idInt },
    skip: !isValidId,
  });

  if (!isValidId || !data?.pokemon?.[0]) {
    return { data: null, loading, error };
  }

  const p = data.pokemon[0];

  return {
    data: {
      id: p.id,
      name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name || '',
      number: parseInt(p.id, 10),
      types: p.pokemontypes?.map((pt: any) => pt.type.typenames?.[0]?.name).filter(Boolean) || [],
      sprite: p.pokemonsprites?.[0]?.sprites || null,
      weight: p.weight ?? null,
      height: p.height ?? null,
      captureRate: p.pokemonspecy.capture_rate ?? null,
      stats:
        p.pokemonstats?.map((ps: any) => ({
          name: ps.stat?.name || '',
          baseStat: ps.base_stat || 0,
        })) || [],
    },
    loading,
    error,
  };
};
