import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography,
  Divider, useMediaQuery, useTheme, Avatar, Tooltip,
} from '@mui/material';
import {
  LayoutDashboard, Users, CalendarCheck, Clock, DollarSign,
  Briefcase, Ticket, FileText, Settings, ChevronLeft, ChevronRight,
  Building2, BarChart3, LogOut, Menu,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 68;

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE'] },
  { path: '/employees', label: 'Employees', icon: Users, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'] },
  { path: '/departments', label: 'Departments', icon: Building2, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
  { path: '/leave', label: 'Leave Management', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE'] },
  { path: '/attendance', label: 'Attendance', icon: Clock, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE'] },
  { path: '/payroll', label: 'Payroll', icon: DollarSign, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'FINANCE'] },
  { path: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'] },
  { path: '/tickets', label: 'Help Desk', icon: Ticket, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN', 'EMPLOYEE'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'HR_ADMIN'] },
  { path: '/documents', label: 'Documents', icon: FileText, roles: ['SUPER_ADMIN', 'HR_ADMIN', 'EMPLOYEE'] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['SUPER_ADMIN'] },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const userRoles = user?.roles || [];
  const filteredItems = menuItems.filter((item) =>
    item.roles.some((r) => userRoles.includes(r))
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: collapsed ? 1.5 : 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        {!collapsed && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
              EMS Portal
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enterprise Management
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        )}
        {isMobile && (
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <ChevronLeft size={18} />
          </IconButton>
        )}
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', px: collapsed ? 1 : 1.5, py: 1 }}>
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
              <ListItemButton
                selected={isActive}
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  minHeight: 44,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, px: collapsed ? 0 : 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem', fontWeight: 600 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{ borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2 }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
            <LogOut size={20} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" slotProps={{ primary: { sx: { fontSize: '0.875rem' } } }} />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200, bgcolor: 'background.paper', boxShadow: 2, '&:hover': { bgcolor: 'background.paper' } }}
        >
          <Menu size={20} />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', { duration: 200 }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};
