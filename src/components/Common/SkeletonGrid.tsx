import * as React from 'react';
import { Grid } from '@mui/material';

interface SkeletonGridProps {
  /**
   * Número de skeletons a mostrar
   */
  count?: number;
  /**
   * Configuración de columnas responsive
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /**
   * Componente skeleton a renderizar
   */
  SkeletonComponent: React.ComponentType;
  /**
   * Espaciado entre items
   */
  spacing?: number;
}

/**
 * Grid genérico para mostrar skeletons de carga
 * 
 * @example
 * <SkeletonGrid 
 *   count={8} 
 *   columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
 *   SkeletonComponent={EventCardSkeleton}
 * />
 */
export function SkeletonGrid({ 
  count = 8, 
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  SkeletonComponent,
  spacing = 3,
}: SkeletonGridProps) {
  return (
    <Grid container spacing={spacing}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={columns}>
          <SkeletonComponent />
        </Grid>
      ))}
    </Grid>
  );
}

