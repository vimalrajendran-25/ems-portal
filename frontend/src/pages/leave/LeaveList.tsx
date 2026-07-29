import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { leaveApi } from '../../api/leaveApi';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import type { LeaveRequest } from '../../types/leave';
import { toast } from 'sonner';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'danger',
  CANCELLED: 'info',
};

export const LeaveList: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveApi.getAll({ status: filter || undefined, page: 0, size: 20 });
      setLeaves(res.data.data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, [filter]);

  const handleApprove = async (id: number) => {
    try {
      await leaveApi.approve(id);
      toast.success('Leave approved');
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await leaveApi.reject(id);
      toast.success('Leave rejected');
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  const columns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'leaveType', header: 'Leave Type' },
    {
      key: 'status', header: 'Status',
      render: (l: LeaveRequest) => <Badge variant={statusVariant[l.status] || 'default'}>{l.status}</Badge>,
    },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'totalDays', header: 'Days' },
    { key: 'reason', header: 'Reason' },
    {
      key: 'actions', header: 'Actions',
      render: (l: LeaveRequest) => (
        <Stack direction="row" spacing={0.5}>
          {l.status === 'PENDING' && (
            <>
              <Chip icon={<CheckCircle size={14} />} label="Approve" size="small" color="success" onClick={(e) => { e.stopPropagation(); handleApprove(l.id); }} sx={{ cursor: 'pointer' }} />
              <Chip icon={<XCircle size={14} />} label="Reject" size="small" color="error" onClick={(e) => { e.stopPropagation(); handleReject(l.id); }} sx={{ cursor: 'pointer' }} />
            </>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Leave Management</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate('/leave/request')}>
          Apply Leave
        </Button>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {['', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <Chip
            key={s}
            label={s || 'ALL'}
            onClick={() => setFilter(s)}
            color={filter === s ? 'primary' : 'default'}
            variant={filter === s ? 'filled' : 'outlined'}
            sx={{ fontWeight: 500, cursor: 'pointer' }}
          />
        ))}
      </Stack>

      <DataTable columns={columns} data={leaves} loading={loading} />
    </Box>
  );
};
