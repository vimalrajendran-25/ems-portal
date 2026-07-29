import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Typography, Button, TextField, MenuItem, Paper, Stack, FormControlLabel, Checkbox } from '@mui/material';
import { ArrowLeft, Calendar } from 'lucide-react';
import { leaveApi } from '../../api/leaveApi';
import { toast } from 'sonner';

interface LeaveForm {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  halfDay: boolean;
}

export const LeaveRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LeaveForm>();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const days = startDate && endDate
    ? Math.max(0, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const onSubmit = async (data: LeaveForm) => {
    setLoading(true);
    try {
      await leaveApi.create({
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        halfDay: data.halfDay,
      });
      toast.success('Leave request submitted');
      navigate('/leave');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/leave')} sx={{ mb: 2, color: 'text.secondary' }}>
        Back
      </Button>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <Calendar size={24} color="#3b82f6" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Apply for Leave</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth select label="Leave Type" sx={{ mb: 2.5 }} defaultValue="" {...register('leaveType', { required: 'Select leave type' })} error={!!errors.leaveType} helperText={errors.leaveType?.message}>
            <MenuItem value="">Select type...</MenuItem>
            <MenuItem value="SICK_LEAVE">Sick Leave</MenuItem>
            <MenuItem value="CASUAL_LEAVE">Casual Leave</MenuItem>
            <MenuItem value="EARNED_LEAVE">Earned Leave</MenuItem>
            <MenuItem value="MATERNITY_LEAVE">Maternity Leave</MenuItem>
            <MenuItem value="PATERNITY_LEAVE">Paternity Leave</MenuItem>
            <MenuItem value="COMP_OFF">Comp Off</MenuItem>
          </TextField>

          <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
            <TextField fullWidth type="date" label="Start Date" slotProps={{ inputLabel: { shrink: true } }} {...register('startDate', { required: 'Required' })} error={!!errors.startDate} helperText={errors.startDate?.message} />
            <TextField fullWidth type="date" label="End Date" slotProps={{ inputLabel: { shrink: true } }} {...register('endDate', { required: 'Required' })} error={!!errors.endDate} helperText={errors.endDate?.message} />
          </Stack>

          {days > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total days: <strong>{days}</strong>
            </Typography>
          )}

          <TextField fullWidth multiline rows={3} label="Reason" placeholder="Enter reason for leave..." sx={{ mb: 2 }} {...register('reason')} />

          <FormControlLabel control={<Checkbox {...register('halfDay')} />} label="Half day" sx={{ mb: 3 }} />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Leave Request'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/leave')}>Cancel</Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
