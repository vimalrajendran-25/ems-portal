package com.ems.service;

import com.ems.dto.response.DashboardResponse;
import com.ems.entity.enums.LeaveStatus;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public DashboardResponse getAdminDashboard() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countActiveEmployees();
        long pendingLeaves = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);

        List<Object[]> deptData = employeeRepository.countByDepartment();
        List<DashboardResponse.DepartmentCount> deptAnalytics = deptData.stream()
                .map(row -> DashboardResponse.DepartmentCount.builder()
                        .name((String) row[0])
                        .count((long) row[1])
                        .build())
                .collect(Collectors.toList());

        List<Object[]> leaveTypeData = leaveRequestRepository.countByLeaveType();
        Map<String, Long> leaveByType = leaveTypeData.stream()
                .collect(Collectors.toMap(
                        row -> ((Enum) row[0]).name(),
                        row -> (long) row[1]
                ));

        long approved = leaveRequestRepository.countByStatus(LeaveStatus.APPROVED);
        long rejected = leaveRequestRepository.countByStatus(LeaveStatus.REJECTED);

        List<DashboardResponse.MonthlyTrend> employeeGrowth = Arrays.asList(
                DashboardResponse.MonthlyTrend.builder().month("Jan").count(10).build(),
                DashboardResponse.MonthlyTrend.builder().month("Feb").count(15).build(),
                DashboardResponse.MonthlyTrend.builder().month("Mar").count(25).build(),
                DashboardResponse.MonthlyTrend.builder().month("Apr").count(35).build(),
                DashboardResponse.MonthlyTrend.builder().month("May").count(42).build(),
                DashboardResponse.MonthlyTrend.builder().month("Jun").count(48).build()
        );

        List<DashboardResponse.RecentActivity> activities = Arrays.asList(
                DashboardResponse.RecentActivity.builder()
                        .type("NEW_JOINEE").description("John Doe joined as Software Engineer")
                        .timestamp(LocalDateTime.now().minusHours(2).toString()).user("System").build(),
                DashboardResponse.RecentActivity.builder()
                        .type("LEAVE").description("Jane Smith applied for sick leave")
                        .timestamp(LocalDateTime.now().minusHours(4).toString()).user("Jane Smith").build(),
                DashboardResponse.RecentActivity.builder()
                        .type("RESIGNATION").description("Bob Wilson submitted resignation")
                        .timestamp(LocalDateTime.now().minusDays(1).toString()).user("Bob Wilson").build()
        );

        return DashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .pendingLeaves(pendingLeaves)
                .openTickets(12)
                .attritionRate(2.5)
                .departmentAnalytics(deptAnalytics)
                .employeeGrowth(employeeGrowth)
                .recentActivities(activities)
                .leaveAnalytics(DashboardResponse.LeaveAnalytics.builder()
                        .approved(approved)
                        .pending(pendingLeaves)
                        .rejected(rejected)
                        .byType(leaveByType)
                        .build())
                .build();
    }
}
