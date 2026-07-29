import React from 'react';
import { Chip, ChipProps } from '@mui/material';

const colorMap: Record<string, ChipProps['color']> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'info',
  default: 'default',
};

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => (
  <Chip label={children} size="small" color={colorMap[variant] || 'default'} sx={{ fontWeight: 500, fontSize: '0.75rem' }} />
);
