export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  departmentId: number;
  managerName: string;
  dateOfJoining: string;
  dateOfBirth: string;
  employmentType: string;
  status: string;
  address: string;
  salary: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  profileImageUrl: string;
  createdAt: string;
}

export interface EmployeeRequest {
  employeeId: string;
  departmentId?: number;
  managerId?: number;
  designation: string;
  dateOfBirth: string;
  dateOfJoining: string;
  employmentType: string;
  phone: string;
  address: string;
  salary: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
}
