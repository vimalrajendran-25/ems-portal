import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Card, CardContent, TextField, Button, Typography, Paper,
} from '@mui/material';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); clearError(); }
  }, [error, clearError]);

  const onSubmit = async (data: RegisterForm) => {
    await registerUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, bgcolor: 'primary.main', borderRadius: 3, mb: 2 }}>
            <Building2 color="#fff" size={32} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>EMS Portal</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Create your account</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <TextField fullWidth label="First Name" {...register('firstName', { required: 'Required' })} error={!!errors.firstName} helperText={errors.firstName?.message} />
                <TextField fullWidth label="Last Name" {...register('lastName', { required: 'Required' })} error={!!errors.lastName} helperText={errors.lastName?.message} />
              </Box>
              <TextField fullWidth label="Email" type="email" sx={{ mb: 2.5 }} {...register('email', { required: 'Required' })} error={!!errors.email} helperText={errors.email?.message} />
              <TextField fullWidth label="Password" type="password" sx={{ mb: 2.5 }} {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} error={!!errors.password} helperText={errors.password?.message} />
              <TextField fullWidth label="Confirm Password" type="password" sx={{ mb: 3 }} {...register('confirmPassword', { validate: (v) => v === watch('password') || 'Passwords do not match' })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5 }}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
