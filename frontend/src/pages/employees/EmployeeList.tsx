import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  Box, Button, Typography, InputBase, IconButton, Grid, Pagination, Stack,
} from '@mui/material';
import { Search, Filter } from 'lucide-react';
import { employeeApi } from '../../api/employeeApi';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import type { Employee } from '../../types/employee';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeApi.getAll({ search, page, size: 10 });
      setEmployees(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [search, page]);

  const columns = [
    { key: 'employeeId', header: 'ID' },
    {
      key: 'name', header: 'Name',
      render: (emp: Employee) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{emp.firstName} {emp.lastName}</Typography>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'designation', header: 'Designation' },
    { key: 'department', header: 'Department' },
    {
      key: 'status', header: 'Status',
      render: (emp: Employee) => (
        <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'warning'}>{emp.status}</Badge>
      ),
    },
    { key: 'employmentType', header: 'Type' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Employees</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate('/employees/new')}>
          Add Employee
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2, px: 2, py: 0.75, flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ opacity: 0.5, marginRight: 8 }} />
          <InputBase
            placeholder="Search employees..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ fontSize: '0.875rem', width: '100%' }}
          />
        </Box>
        <Button variant="outlined" startIcon={<Filter size={18} />}>Filter</Button>
      </Box>

      <DataTable columns={columns} data={employees} loading={loading} onRowClick={(emp) => navigate(`/employees/${emp.id}`)} />

      {totalPages > 1 && (
        <Stack spacing={2} sx={{ alignItems: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, p) => setPage(p - 1)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
};
