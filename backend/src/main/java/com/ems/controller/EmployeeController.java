package com.ems.controller;

import com.ems.dto.request.EmployeeRequest;
import com.ems.dto.response.ApiResponse;
import com.ems.dto.response.EmployeeResponse;
import com.ems.dto.response.PageResponse;
import com.ems.security.SecurityUtils;
import com.ems.service.EmployeeService;
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

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management", description = "Employee CRUD APIs")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get all employees")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE')")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getAllEmployees(
            @RequestParam(required = false) String search,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(PageResponse.from(employeeService.getAllEmployees(search, pageable))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeById(id)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current employee profile")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getMyProfile() {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getEmployeeByUserId(securityUtils.getCurrentUserId())));
    }

    @PostMapping
    @Operation(summary = "Create new employee")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Employee created successfully",
                        employeeService.createEmployee(request, securityUtils.getCurrentUserId())));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Employee updated successfully",
                        employeeService.updateEmployee(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
    }
}
