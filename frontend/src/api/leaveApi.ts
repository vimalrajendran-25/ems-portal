import axiosInstance from './axiosInstance';
import type { LeaveRequest, LeaveRequestDto, LeaveBalance } from '../types/leave';
import type { ApiResponse, PageResponse } from '../types/api';

export const leaveApi = {
  getAll: (params?: { status?: string; employeeId?: number; page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PageResponse<LeaveRequest>>>('/leaves', { params }),

  getMyLeaves: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PageResponse<LeaveRequest>>>('/leaves/my-leaves', { params }),

  getById: (id: number) =>
    axiosInstance.get<ApiResponse<LeaveRequest>>(`/leaves/${id}`),

  create: (data: LeaveRequestDto) =>
    axiosInstance.post<ApiResponse<LeaveRequest>>('/leaves', data),

  approve: (id: number, comment?: string) =>
    axiosInstance.put<ApiResponse<LeaveRequest>>(`/leaves/${id}/approve`, { comment }),

  reject: (id: number, comment?: string) =>
    axiosInstance.put<ApiResponse<LeaveRequest>>(`/leaves/${id}/reject`, { comment }),

  getBalance: () =>
    axiosInstance.get<ApiResponse<LeaveBalance>>('/leaves/balance'),
};
