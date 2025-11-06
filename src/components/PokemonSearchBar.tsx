import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { tss } from '../tss';

interface PokemonSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const PokemonSearchBar: React.FC<PokemonSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search Pokémon by name, number, or type...',
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.searchContainer}>
      <Input
        aria-label="Search Pokémon"
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="large"
        className={classes.searchInput}
      />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  searchContainer: {
    marginBottom: '24px',
    maxWidth: '500px',
    width: '100%',
    '@media (max-width: 768px)': {
      marginBottom: '20px',
    },
    '@media (max-width: 480px)': {
      marginBottom: '16px',
    },
  },
  searchInput: {
    backgroundColor: '#1a1a2e',
    color: theme.color.text.primary,
    transition: 'all 0.2s ease',
    border: '1px solid #2a2a4e',
    '& input': {
      backgroundColor: '#1a1a2e',
      color: theme.color.text.primary,
      transition: 'all 0.2s ease',
      '&::placeholder': {
        color: '#888',
      },
    },
    '& .ant-input-prefix': {
      color: '#888',
    },
    '&:focus-within': {
      borderColor: '#4a90e2',
      boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
      backgroundColor: '#1f1f35',
      '& input': {
        backgroundColor: '#1f1f35',
      },
    },
    '&:hover': {
      borderColor: '#3a3a5e',
      backgroundColor: '#1f1f35',
      '& input': {
        backgroundColor: '#1f1f35',
      },
    },
  },
}));
