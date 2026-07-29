import axiosInstance from './axiosInstance';
import type { DashboardData } from '../types/dashboard';
import type { ApiResponse } from '../types/api';

export const dashboardApi = {
  getAdmin: () =>
    axiosInstance.get<ApiResponse<DashboardData>>('/dashboard/admin'),
};
