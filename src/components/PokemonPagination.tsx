import React from 'react';
import { Pagination } from 'antd';
import { tss } from '../tss';

interface PokemonPaginationProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export const PokemonPagination: React.FC<PokemonPaginationProps> = ({
  currentPage,
  total,
  pageSize,
  onChange,
}) => {
  const { classes } = useStyles();

  // Guard against invalid page size
  if (pageSize === 0) {
    return null;
  }

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    onChange(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) {
    return null;
  }

  // Calculate range for display
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className={classes.paginationContainer}>
      <div className={classes.paginationWrapper}>
        <div className={classes.paginationPages}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper={false}
            className={classes.pagination}
          />
        </div>
        <div className={classes.paginationTotal}>
          <span className={classes.paginationTotalText}>
            {start}-{end} of {total} Pokémon
          </span>
        </div>
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    padding: '24px 0',
    '@media (max-width: 768px)': {
      marginTop: '24px',
      padding: '16px 0',
    },
    '@media (max-width: 480px)': {
      marginTop: '20px',
      padding: '12px 0',
    },
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
  paginationTotalText: {
    color: theme.color.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    '@media (max-width: 480px)': {
      fontSize: '12px',
    },
  },
  pagination: {
    '@media (max-width: 768px)': {
      '& .ant-pagination-item': {
        minWidth: '32px',
        height: '32px',
        lineHeight: '32px',
        fontSize: '14px',
      },
      '& .ant-pagination-prev, & .ant-pagination-next': {
        minWidth: '32px',
        height: '32px',
        '& .ant-pagination-item-link': {
          minWidth: '32px',
          height: '32px',
          lineHeight: '30px',
        },
      },
    },
    '@media (max-width: 480px)': {
      '& .ant-pagination-item': {
        minWidth: '28px',
        height: '28px',
        lineHeight: '28px',
        fontSize: '12px',
        marginRight: '4px',
      },
      '& .ant-pagination-prev, & .ant-pagination-next': {
        minWidth: '28px',
        height: '28px',
        '& .ant-pagination-item-link': {
          minWidth: '28px',
          height: '28px',
          lineHeight: '26px',
        },
      },
      '& .ant-pagination-jump-prev, & .ant-pagination-jump-next': {
        minWidth: '28px',
        height: '28px',
        '& .ant-pagination-item-link': {
          minWidth: '28px',
          height: '28px',
          lineHeight: '26px',
        },
      },
    },
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
      '& .ant-pagination-item-container .ant-pagination-item-link-icon': {
        color: theme.color.text.primary,
        opacity: 0.7,
      },
    },
    '& .ant-pagination-item-ellipsis': {
      color: '#888',
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
      // Style "Next 5 Pages" button or any buttons in pagination options
      '& .ant-pagination-options button': {
        backgroundColor: '#2a2a4e',
        borderColor: '#4a90e2',
        color: theme.color.text.primary,
        borderRadius: '6px',
        padding: '6px 16px',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        border: '1px solid',
        '&:hover': {
          backgroundColor: '#4a90e2',
          borderColor: '#4a90e2',
          color: '#ffffff',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      // Style any standalone buttons in pagination (like "Next 5 Pages")
      '& > button': {
        backgroundColor: '#2a2a4e',
        borderColor: '#4a90e2',
        color: theme.color.text.primary,
        borderRadius: '6px',
        padding: '6px 16px',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        border: '1px solid',
        '&:hover': {
          backgroundColor: '#4a90e2',
          borderColor: '#4a90e2',
          color: '#ffffff',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
    },
    '& .ant-pagination-total-text': {
      display: 'none',
    },
  },
}));
