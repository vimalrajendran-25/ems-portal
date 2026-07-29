import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'sonner';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employee Management',
  '/departments': 'Departments',
  '/leave': 'Leave Management',
  '/attendance': 'Attendance',
  '/payroll': 'Payroll',
  '/recruitment': 'Recruitment',
  '/tickets': 'Help Desk',
  '/reports': 'Reports & Analytics',
  '/documents': 'Documents',
  '/settings': 'Settings',
};

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'EMS Portal';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={title} />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: 'background.default',
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Toaster position="top-right" richColors />
    </Box>
  );
};
