export interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  openTickets: number;
  attritionRate: number;
  departmentAnalytics: DepartmentCount[];
  employeeGrowth: MonthlyTrend[];
  recentActivities: RecentActivity[];
  leaveAnalytics: LeaveAnalytics;
}

export interface DepartmentCount {
  name: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface RecentActivity {
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface LeaveAnalytics {
  approved: number;
  pending: number;
  rejected: number;
  byType: Record<string, number>;
}
