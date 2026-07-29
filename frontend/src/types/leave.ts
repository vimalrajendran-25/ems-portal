export interface LeaveRequest {
  id: number;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  halfDay: boolean;
  employeeName: string;
  employeeId: string;
  approvedByName: string;
  approvalComment: string;
  approvedAt: string;
  createdAt: string;
}

export interface LeaveRequestDto {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  halfDay?: boolean;
}

export interface LeaveBalance {
  SICK_LEAVE: number;
  CASUAL_LEAVE: number;
  EARNED_LEAVE: number;
  MATERNITY_LEAVE: number;
  PATERNITY_LEAVE: number;
  COMP_OFF: number;
}
