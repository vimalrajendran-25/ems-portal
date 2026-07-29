import axiosInstance from './axiosInstance';
import type { Employee, EmployeeRequest } from '../types/employee';
import type { ApiResponse, PageResponse } from '../types/api';

export const employeeApi = {
  getAll: (params?: { search?: string; page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PageResponse<Employee>>>('/employees', { params }),

  getById: (id: number) =>
    axiosInstance.get<ApiResponse<Employee>>(`/employees/${id}`),

  getMe: () =>
    axiosInstance.get<ApiResponse<Employee>>('/employees/me'),

  create: (data: EmployeeRequest) =>
    axiosInstance.post<ApiResponse<Employee>>('/employees', data),

  update: (id: number, data: EmployeeRequest) =>
    axiosInstance.put<ApiResponse<Employee>>(`/employees/${id}`, data),

  delete: (id: number) =>
    axiosInstance.delete<ApiResponse<void>>(`/employees/${id}`),
};
