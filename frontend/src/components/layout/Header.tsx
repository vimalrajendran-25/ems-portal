import React from 'react';
import { Box, Typography, IconButton, InputBase, Badge, Tooltip } from '@mui/material';
import { Bell, Moon, Sun, Search } from 'lucide-react';
import { useThemeContext } from '../../contexts/ThemeContext';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 2,
            py: 0.75,
          }}
        >
          <Search size={18} style={{ opacity: 0.5, marginRight: 8 }} />
          <InputBase placeholder="Search..." sx={{ fontSize: '0.875rem', width: 200 }} />
        </Box>

        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme} size="small">
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Tooltip>

        <IconButton size="small">
          <Badge variant="dot" color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
};
