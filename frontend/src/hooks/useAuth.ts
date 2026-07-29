import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { login, register, logout, clearError } from '../store/slices/authSlice';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (data: LoginRequest) => dispatch(login(data)),
    register: (data: RegisterRequest) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    isAdmin: user?.roles?.some((r) => ['SUPER_ADMIN', 'HR_ADMIN'].includes(r)),
    isHR: user?.roles?.some((r) => ['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE'].includes(r)),
  };
};
