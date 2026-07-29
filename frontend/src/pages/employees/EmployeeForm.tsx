import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, Button, TextField, MenuItem, Grid, Paper, Stack,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { employeeApi } from '../../api/employeeApi';
import { toast } from 'sonner';
import type { EmployeeRequest } from '../../types/employee';

export const EmployeeForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeRequest>();

  useEffect(() => {
    if (id) {
      employeeApi.getById(Number(id)).then((res) => {
        const emp = res.data.data;
        reset({
          employeeId: emp.employeeId,
          designation: emp.designation,
          dateOfBirth: emp.dateOfBirth?.split('T')[0],
          dateOfJoining: emp.dateOfJoining?.split('T')[0],
          employmentType: emp.employmentType,
          phone: emp.phone,
          address: emp.address,
          salary: emp.salary,
          emergencyContactName: emp.emergencyContactName,
          emergencyContactPhone: emp.emergencyContactPhone,
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: EmployeeRequest) => {
    setLoading(true);
    try {
      if (isEdit) {
        await employeeApi.update(Number(id), data);
        toast.success('Employee updated successfully');
      } else {
        await employeeApi.create(data);
        toast.success('Employee created successfully');
      }
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/employees')} sx={{ mb: 2, color: 'text.secondary' }}>
        Back
      </Button>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Employee ID" {...register('employeeId', { required: 'Required' })} error={!!errors.employeeId} helperText={errors.employeeId?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Designation" {...register('designation', { required: 'Required' })} error={!!errors.designation} helperText={errors.designation?.message} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="date" label="Date of Birth" slotProps={{ inputLabel: { shrink: true } }} {...register('dateOfBirth')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="date" label="Date of Joining" slotProps={{ inputLabel: { shrink: true } }} {...register('dateOfJoining')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Employment Type" defaultValue="FULL_TIME" {...register('employmentType')}>
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="CONTRACT">Contract</MenuItem>
                <MenuItem value="INTERN">Intern</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" {...register('phone')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="number" label="Salary" {...register('salary', { valueAsNumber: true })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Emergency Contact Name" {...register('emergencyContactName')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Emergency Contact Phone" {...register('emergencyContactPhone')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Address" {...register('address')} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/employees')}>Cancel</Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
