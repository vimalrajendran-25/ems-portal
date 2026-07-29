package com.ems.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeRequest {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    private Long departmentId;
    private Long managerId;
    private String designation;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private String employmentType;
    private String phone;
    private String address;
    private BigDecimal salary;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
