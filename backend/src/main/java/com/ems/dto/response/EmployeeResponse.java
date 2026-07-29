package com.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String designation;
    private String department;
    private Long departmentId;
    private String managerName;
    private LocalDate dateOfJoining;
    private LocalDate dateOfBirth;
    private String employmentType;
    private String status;
    private String address;
    private BigDecimal salary;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String profileImageUrl;
    private LocalDateTime createdAt;
}
