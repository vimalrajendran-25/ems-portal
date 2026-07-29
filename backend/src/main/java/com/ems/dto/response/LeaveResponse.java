package com.ems.dto.response;

import com.ems.entity.enums.LeaveStatus;
import com.ems.entity.enums.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private Long id;
    private LeaveType leaveType;
    private LeaveStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private String reason;
    private Boolean halfDay;
    private String employeeName;
    private String employeeId;
    private String approvedByName;
    private String approvalComment;
    private LocalDate approvedAt;
    private LocalDateTime createdAt;
}
