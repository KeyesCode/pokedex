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
  const searchPlaceholder = placeholder;
  const { classes } = useStyles();

  return (
    <div className={classes.searchContainer}>
      <Input
        placeholder={searchPlaceholder}
        prefix={<SearchOutlined />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="large"
        className={classes.searchInput}
      />
    </div>
  );
};

const useStyles = tss.create(() => ({
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
}));
