import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
  IconButton, Checkbox, FormControlLabel, Paper, Alert,
} from '@mui/material';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginForm) => {
    await login(data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              borderRadius: 3,
              mb: 2,
            }}
          >
            <Building2 color="#fff" size={32} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>EMS Portal</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Sign in to your account</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ '& .MuiTextField-root': { mb: 2.5 } }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="you@company.com"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{ input: { endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ), } }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2">Remember me</Typography>} />
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5 }}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
            </Typography>

            <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'action.hover' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Demo Credentials:</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>Admin: admin@ems.com / Admin@123</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>Employee: john@ems.com / Admin@123</Typography>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
