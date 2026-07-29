package com.ems.controller;

import com.ems.dto.request.LeaveRequestDto;
import com.ems.dto.response.ApiResponse;
import com.ems.dto.response.LeaveResponse;
import com.ems.dto.response.PageResponse;
import com.ems.entity.Employee;
import com.ems.entity.enums.LeaveStatus;
import com.ems.entity.enums.LeaveType;
import com.ems.repository.EmployeeRepository;
import com.ems.security.SecurityUtils;
import com.ems.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management", description = "Leave request APIs")
public class LeaveController {

    private final LeaveService leaveService;
    private final SecurityUtils securityUtils;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    @Operation(summary = "Get all leave requests")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE')")
    public ResponseEntity<ApiResponse<PageResponse<LeaveResponse>>> getAllLeaves(
            @RequestParam(required = false) LeaveStatus status,
            @RequestParam(required = false) Long employeeId,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(PageResponse.from(
                        leaveService.getAllLeaves(status, employeeId, pageable))));
    }

    @GetMapping("/my-leaves")
    @Operation(summary = "Get my leave requests")
    public ResponseEntity<ApiResponse<PageResponse<LeaveResponse>>> getMyLeaves(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Long userId = securityUtils.getCurrentUserId();
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return ResponseEntity.ok(
                ApiResponse.success(PageResponse.from(
                        leaveService.getAllLeaves(null, employee.getId(), pageable))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get leave by ID")
    public ResponseEntity<ApiResponse<LeaveResponse>> getLeave(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getLeaveById(id)));
    }

    @PostMapping
    @Operation(summary = "Create leave request")
    public ResponseEntity<ApiResponse<LeaveResponse>> createLeave(
            @Valid @RequestBody LeaveRequestDto request) {
        return ResponseEntity.ok(
                ApiResponse.success("Leave request submitted",
                        leaveService.createLeaveRequest(request, securityUtils.getCurrentUserId())));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve leave request")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<LeaveResponse>> approveLeave(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.getOrDefault("comment", "") : "";
        return ResponseEntity.ok(
                ApiResponse.success("Leave approved",
                        leaveService.approveLeave(id, securityUtils.getCurrentUserId(), comment)));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject leave request")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<LeaveResponse>> rejectLeave(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.getOrDefault("comment", "") : "";
        return ResponseEntity.ok(
                ApiResponse.success("Leave rejected",
                        leaveService.rejectLeave(id, securityUtils.getCurrentUserId(), comment)));
    }

    @GetMapping("/balance")
    @Operation(summary = "Get my leave balance")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getLeaveBalance() {
        Long userId = securityUtils.getCurrentUserId();
        Map<String, BigDecimal> balances = Map.of(
            "SICK_LEAVE", leaveService.getLeaveBalance(userId, LeaveType.SICK_LEAVE),
            "CASUAL_LEAVE", leaveService.getLeaveBalance(userId, LeaveType.CASUAL_LEAVE),
            "EARNED_LEAVE", leaveService.getLeaveBalance(userId, LeaveType.EARNED_LEAVE),
            "MATERNITY_LEAVE", leaveService.getLeaveBalance(userId, LeaveType.MATERNITY_LEAVE),
            "PATERNITY_LEAVE", leaveService.getLeaveBalance(userId, LeaveType.PATERNITY_LEAVE),
            "COMP_OFF", leaveService.getLeaveBalance(userId, LeaveType.COMP_OFF)
        );
        return ResponseEntity.ok(ApiResponse.success(balances));
    }
}
