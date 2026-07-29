import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Paper, Avatar, Chip, Skeleton, Stack, Divider,
} from '@mui/material';
import { ArrowLeft, Mail, Phone, Calendar, Building2, DollarSign, MapPin, User } from 'lucide-react';
import { employeeApi } from '../../api/employeeApi';
import { Badge } from '../../components/ui/Badge';
import type { Employee } from '../../types/employee';

const DetailRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
    <Icon size={16} style={{ opacity: 0.5, marginTop: 2 }} />
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value || '-'}</Typography>
    </Box>
  </Stack>
);

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      employeeApi.getById(Number(id))
        .then((res) => setEmployee(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => <Grid size={{ xs: 12, md: 4 }} key={i}><Skeleton variant="rounded" height={200} /></Grid>)}
        </Grid>
      </Box>
    );
  }

  if (!employee) {
    return <Typography>Employee not found</Typography>;
  }

  return (
    <Box>
      <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/employees')} sx={{ mb: 2, color: 'text.secondary' }}>
        Back to Employees
      </Button>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
              {employee.firstName[0]}{employee.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography color="text.secondary">{employee.designation}</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'warning'}>{employee.status}</Badge>
                <Typography variant="caption" color="text.secondary">{employee.employeeId}</Typography>
              </Stack>
            </Box>
          </Stack>
          <Button variant="outlined" onClick={() => navigate(`/employees/${id}/edit`)}>Edit Profile</Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={16} /> Personal Details
            </Typography>
            <Stack spacing={2}>
              <DetailRow icon={Mail} label="Email" value={employee.email} />
              <DetailRow icon={Phone} label="Phone" value={employee.phone} />
              <DetailRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth} />
              <DetailRow icon={MapPin} label="Address" value={employee.address} />
              <DetailRow icon={User} label="Emergency Contact" value={`${employee.emergencyContactName} (${employee.emergencyContactPhone})`} />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Building2 size={16} /> Professional Details
            </Typography>
            <Stack spacing={2}>
              <DetailRow icon={Building2} label="Department" value={employee.department} />
              <DetailRow icon={User} label="Manager" value={employee.managerName} />
              <DetailRow icon={Calendar} label="Date of Joining" value={employee.dateOfJoining} />
              <DetailRow icon={Calendar} label="Employment Type" value={employee.employmentType} />
              <DetailRow icon={DollarSign} label="Salary" value={employee.salary ? `$${employee.salary.toLocaleString()}` : '-'} />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Quick Stats</Typography>
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 2 }}>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>Attendance</Typography>
                <Typography variant="h4" color="success.dark" sx={{ fontWeight: 700 }}>94%</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
                <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>Leave Balance</Typography>
                <Typography variant="h4" color="info.dark" sx={{ fontWeight: 700 }}>24 days</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'secondary.lighter', borderRadius: 2 }}>
                <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 600 }}>Performance</Typography>
                <Typography variant="h4" color="secondary.dark" sx={{ fontWeight: 700 }}>4.2/5</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
