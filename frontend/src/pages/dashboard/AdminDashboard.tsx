import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Skeleton, Stack } from '@mui/material';
import { Users, UserCheck, CalendarClock, Ticket, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { StatCard } from '../../components/ui/StatCard';
import type { DashboardData } from '../../types/dashboard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdmin()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
            <Skeleton variant="rounded" height={120} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Employees" value={data?.totalEmployees || 0} icon={<Users size={24} />} trend={{ value: '+12% this month', positive: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active Employees" value={data?.activeEmployees || 0} icon={<UserCheck size={24} />} trend={{ value: '+5% this month', positive: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Pending Leaves" value={data?.pendingLeaves || 0} icon={<CalendarClock size={24} />} trend={{ value: data?.pendingLeaves && data.pendingLeaves > 5 ? 'Needs attention' : 'All clear', positive: data?.pendingLeaves ? data.pendingLeaves <= 5 : true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Open Tickets" value={data?.openTickets || 0} icon={<Ticket size={24} />} trend={{ value: data?.openTickets ? `${data.openTickets} unresolved` : 'All resolved', positive: data?.openTickets ? data.openTickets <= 5 : true }} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Employee Growth</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.employeeGrowth || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Department Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data?.departmentAnalytics || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {(data?.departmentAnalytics || []).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Leave Analytics</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Approved', count: data?.leaveAnalytics?.approved || 0 },
                { name: 'Pending', count: data?.leaveAnalytics?.pending || 0 },
                { name: 'Rejected', count: data?.leaveAnalytics?.rejected || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Recent Activities</Typography>
            <Stack spacing={2}>
              {data?.recentActivities?.map((activity, index) => (
                <Stack key={index} direction="row" spacing={2} sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'flex-start', '&:last-child': { borderBottom: 0, pb: 0 } }}>
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: activity.type === 'NEW_JOINEE' ? 'success.lighter' : activity.type === 'LEAVE' ? 'warning.lighter' : 'error.lighter', color: activity.type === 'NEW_JOINEE' ? 'success.main' : activity.type === 'LEAVE' ? 'warning.main' : 'error.main', display: 'flex' }}>
                    {activity.type === 'NEW_JOINEE' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{activity.description}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(activity.timestamp).toLocaleString()}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
