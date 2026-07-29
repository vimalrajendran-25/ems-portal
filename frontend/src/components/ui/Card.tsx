import React from 'react';
import { Paper, PaperProps } from '@mui/material';

export const Card: React.FC<PaperProps> = ({ children, sx, ...props }) => (
  <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', ...sx }} {...props}>
    {children}
  </Paper>
);
