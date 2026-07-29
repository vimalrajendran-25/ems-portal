package com.ems.service;

import com.ems.dto.request.LeaveRequestDto;
import com.ems.dto.response.LeaveResponse;
import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import com.ems.entity.enums.LeaveStatus;
import com.ems.entity.enums.LeaveType;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public Page<LeaveResponse> getAllLeaves(LeaveStatus status, Long employeeId, Pageable pageable) {
        if (employeeId != null) {
            return leaveRequestRepository.findByEmployeeId(employeeId, pageable)
                    .map(this::toResponse);
        }
        if (status != null) {
            return leaveRequestRepository.findByStatus(status, pageable)
                    .map(this::toResponse);
        }
        return leaveRequestRepository.findAll(pageable).map(this::toResponse);
    }

    public LeaveResponse getLeaveById(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));
        return toResponse(leave);
    }

    @Transactional
    public LeaveResponse createLeaveRequest(LeaveRequestDto dto, Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));

        int totalDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        BigDecimal balance = employee.getLeaveBalances().getOrDefault(dto.getLeaveType(), BigDecimal.ZERO);
        if (balance.compareTo(BigDecimal.valueOf(totalDays)) < 0) {
            throw new IllegalArgumentException("Insufficient leave balance for " + dto.getLeaveType() +
                    ". Available: " + balance + ", Requested: " + totalDays);
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setReason(dto.getReason());
        leaveRequest.setTotalDays(totalDays);
        leaveRequest.setHalfDay(dto.getHalfDay() != null ? dto.getHalfDay() : false);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setEmployee(employee);

        leaveRequest = leaveRequestRepository.save(leaveRequest);
        return toResponse(leaveRequest);
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId, Long approverUserId, String comment) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        Employee approver = employeeRepository.findByUserId(approverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", approverUserId));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalArgumentException("Leave is already " + leave.getStatus());
        }

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);
        leave.setApprovalComment(comment);
        leave.setApprovedAt(LocalDate.now());

        Employee employee = leave.getEmployee();
        BigDecimal currentBalance = employee.getLeaveBalances().getOrDefault(leave.getLeaveType(), BigDecimal.ZERO);
        employee.getLeaveBalances().put(leave.getLeaveType(),
                currentBalance.subtract(BigDecimal.valueOf(leave.getTotalDays())));
        employeeRepository.save(employee);

        leave = leaveRequestRepository.save(leave);
        return toResponse(leave);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, Long approverUserId, String comment) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        Employee approver = employeeRepository.findByUserId(approverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", approverUserId));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(approver);
        leave.setApprovalComment(comment);
        leave.setApprovedAt(LocalDate.now());

        leave = leaveRequestRepository.save(leave);
        return toResponse(leave);
    }

    public BigDecimal getLeaveBalance(Long userId, LeaveType leaveType) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));
        return employee.getLeaveBalances().getOrDefault(leaveType, BigDecimal.ZERO);
    }

    private LeaveResponse toResponse(LeaveRequest leave) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .leaveType(leave.getLeaveType())
                .status(leave.getStatus())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .totalDays(leave.getTotalDays())
                .reason(leave.getReason())
                .halfDay(leave.getHalfDay())
                .employeeName(leave.getEmployee().getUser().getFirstName() + " " +
                        leave.getEmployee().getUser().getLastName())
                .employeeId(leave.getEmployee().getEmployeeId())
                .approvedByName(leave.getApprovedBy() != null
                        ? leave.getApprovedBy().getUser().getFirstName() + " " +
                          leave.getApprovedBy().getUser().getLastName()
                        : null)
                .approvalComment(leave.getApprovalComment())
                .approvedAt(leave.getApprovedAt())
                .createdAt(leave.getCreatedAt())
                .build();
    }
}
