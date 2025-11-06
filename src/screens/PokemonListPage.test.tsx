import React from 'react';
import { act, render, screen, waitFor } from 'src/test-utils';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { PokemonListPage } from './PokemonListPage';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

jest.mock('src/hooks/useGetPokemons');
jest.mock('@apollo/client/react', () => ({
  ...jest.requireActual('@apollo/client/react'),
  useApolloClient: jest.fn(() => ({
    query: jest.fn(() => Promise.resolve({ data: {} })),
  })),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockUseGetPokemons = useGetPokemons as jest.MockedFunction<typeof useGetPokemons>;

describe('PokemonListPage', () => {
  beforeEach(() => {
    mockUseGetPokemons.mockReturnValue({
      data: [
        { id: '1', name: 'Bulbasaur', number: 1, types: ['grass', 'poison'], sprite: null },
        { id: '2', name: 'Ivysaur', number: 2, types: ['grass', 'poison'], sprite: null },
        { id: '25', name: 'Pikachu', number: 25, types: ['electric'], sprite: null },
      ],
      loading: false,
      error: undefined,
      totalCount: 160,
    });
  });

  test('it renders', () => {
    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1');
  });

  test('typing in the search bar filters the results', async () => {
    const { getByPlaceholderText, queryByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    // Initially all pokemon should be visible
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();

    // Type in search box
    const searchInput = getByPlaceholderText('Search Pokémon by name, number, or type...');
    await act(async () => {
      await user.type(searchInput, 'pika');
    });

    // Wait for debounced search to complete (250ms + buffer)
    await waitFor(
      () => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument();
        expect(queryByText('Bulbasaur')).not.toBeInTheDocument();
        expect(queryByText('Ivysaur')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );

    // Clear search
    await act(async () => {
      await user.clear(searchInput);
    });

    // Wait for debounced search to complete
    await waitFor(
      () => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('Ivysaur')).toBeInTheDocument();
        expect(screen.getByText('Pikachu')).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  test('search is case insensitive', async () => {
    const { getByPlaceholderText, queryByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = getByPlaceholderText('Search Pokémon by name, number, or type...');

    // Search with uppercase - should find lowercase matches
    await act(async () => {
      await user.type(searchInput, 'BULBASAUR');
    });

    // Wait for debounced search to complete
    await waitFor(
      () => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(queryByText('Pikachu')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );

    // Clear and search with mixed case
    await act(async () => {
      await user.clear(searchInput);
      await user.type(searchInput, 'PiKaChU');
    });

    // Wait for debounced search to complete
    await waitFor(
      () => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument();
        expect(queryByText('Bulbasaur')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  test('search by type is case insensitive', async () => {
    const { getByPlaceholderText, queryByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = getByPlaceholderText('Search Pokémon by name, number, or type...');

    // Search for type with uppercase
    await act(async () => {
      await user.type(searchInput, 'GRASS');
    });

    // Wait for debounced search to complete
    // Should find both Bulbasaur and Ivysaur (both have grass type)
    await waitFor(
      () => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('Ivysaur')).toBeInTheDocument();
        expect(queryByText('Pikachu')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  test('search by number works', async () => {
    const { getByPlaceholderText, queryByText, user } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = getByPlaceholderText('Search Pokémon by name, number, or type...');

    // Search by number
    await act(async () => {
      await user.type(searchInput, '25');
    });

    // Wait for debounced search to complete
    await waitFor(
      () => {
        expect(screen.getByText('Pikachu')).toBeInTheDocument();
        expect(queryByText('Bulbasaur')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });
});
