import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Skeleton } from '@mui/material';
import { leaveApi } from '../../api/leaveApi';
import type { LeaveBalance as LeaveBalanceType } from '../../types/leave';

const leaveLabels: Record<string, string> = {
  SICK_LEAVE: 'Sick Leave',
  CASUAL_LEAVE: 'Casual Leave',
  EARNED_LEAVE: 'Earned Leave',
  MATERNITY_LEAVE: 'Maternity Leave',
  PATERNITY_LEAVE: 'Paternity Leave',
  COMP_OFF: 'Comp Off',
};

const leaveColors: Record<string, string> = {
  SICK_LEAVE: '#ef4444',
  CASUAL_LEAVE: '#f59e0b',
  EARNED_LEAVE: '#10b981',
  MATERNITY_LEAVE: '#ec4899',
  PATERNITY_LEAVE: '#3b82f6',
  COMP_OFF: '#8b5cf6',
};

export const LeaveBalance: React.FC = () => {
  const [balances, setBalances] = useState<LeaveBalanceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveApi.getBalance()
      .then((res) => setBalances(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Leave Balance</Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={140} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {balances && Object.entries(balances).map(([key, value]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  {leaveLabels[key] || key}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: leaveColors[key] || '#6b7280' }}>
                  {value}
                  <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 0.5 }}>days</Typography>
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'action.hover',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: leaveColors[key] || '#6b7280',
                      width: `${Math.min(100, (Number(value) / 20) * 100)}%`,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
