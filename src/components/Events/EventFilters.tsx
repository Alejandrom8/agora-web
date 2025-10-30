import * as React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
  Skeleton,
  useTheme,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { alpha } from '@mui/material/styles';
import { useCategories } from '@/hooks/useCategories';

interface EventFiltersProps {
  query: string;
  setQuery: (v: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (v: string | null) => void;
}

export function EventFilters({
  query,
  setQuery,
  selectedCategoryId,
  setSelectedCategoryId,
}: EventFiltersProps) {
  const theme = useTheme();
  const { categories, isLoading: categoriesLoading } = useCategories({ 
    root_only: true 
  });

  const handleCategoryToggle = (categoryId: string | null) => {
    if (categoryId === null) {
      // Seleccionar "All Events"
      setSelectedCategoryId(null);
    } else {
      // Alternar categoría: si ya está seleccionada, deseleccionar
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      } else {
        setSelectedCategoryId(categoryId);
      }
    }
  };

  const isAllSelected = selectedCategoryId === null;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          placeholder="Busca por el nombre del evento..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          size="medium"
          slotProps={{
            input: {
              sx: {
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                borderRadius: 8,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.divider}`,
                '& fieldset': { border: 'none' },
                '&:hover': {
                  borderColor: alpha(theme.palette.text.primary, 0.12),
                },
                '&.Mui-focused': {
                  borderColor: alpha(theme.palette.text.primary, 0.15),
                },
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar búsqueda"
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': { bgcolor: theme.palette.action.hover },
                    }}
                  >
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Categorías - estilo simple horizontal */}
        <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {categoriesLoading ? (
            // Loading state para categorías
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={100}
                height={36}
                sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.text.primary, 0.05) }}
              />
            ))
          ) : (
            <>
              {/* Chip "All Events" */}
              <Chip
                label="Todos los eventos"
                onClick={() => handleCategoryToggle(null)}
                sx={{
                  bgcolor: isAllSelected ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.05),
                  color: isAllSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  border: `1px solid ${isAllSelected ? theme.palette.primary.main : theme.palette.divider}`,
                  fontWeight: isAllSelected ? 600 : 500,
                  fontSize: '0.875rem',
                  px: 1.5,
                  py: 0.5,
                  height: 36,
                  borderRadius: 8,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: isAllSelected ? theme.palette.primary.dark : theme.palette.action.hover,
                    borderColor: isAllSelected ? theme.palette.primary.dark : alpha(theme.palette.text.primary, 0.18),
                  },
                  '& .MuiChip-label': {
                    px: 0,
                  },
                }}
              />
              
              {/* Categorías del API */}
              {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;

                return (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => handleCategoryToggle(category.id)}
                    sx={{
                      bgcolor: isSelected ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.05),
                      color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                      border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.875rem',
                      px: 1.5,
                      py: 0.5,
                      height: 36,
                      borderRadius: 8,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
                        borderColor: isSelected ? theme.palette.primary.dark : alpha(theme.palette.text.primary, 0.18),
                      },
                      '& .MuiChip-label': {
                        px: 0,
                      },
                    }}
                  />
                );
              })}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}


