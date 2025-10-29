import * as React from 'react';
import { Box, Pagination, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface EventsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginación para eventos
 * 
 * @param page - Página actual
 * @param totalPages - Total de páginas disponibles
 * @param onPageChange - Callback cuando cambia la página
 */
export function EventsPagination({ page, totalPages, onPageChange }: EventsPaginationProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              borderColor: alpha(theme.palette.text.primary, 0.3),
            },
            '&.Mui-selected': {
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 700,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            },
          },
        }}
      />
    </Box>
  );
}

