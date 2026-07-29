package com.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long pendingLeaves;
    private long openTickets;
    private double attritionRate;
    private List<DepartmentCount> departmentAnalytics;
    private List<MonthlyTrend> employeeGrowth;
    private List<RecentActivity> recentActivities;
    private LeaveAnalytics leaveAnalytics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentCount {
        private String name;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrend {
        private String month;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String type;
        private String description;
        private String timestamp;
        private String user;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveAnalytics {
        private long approved;
        private long pending;
        private long rejected;
        private Map<String, Long> byType;
    }
}
