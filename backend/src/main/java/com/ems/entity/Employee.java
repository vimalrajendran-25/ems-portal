package com.ems.entity;

import com.ems.entity.enums.LeaveType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "employees")
@Getter
@Setter
public class Employee extends AuditBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(name = "designation")
    private String designation;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "status")
    private String status = "ACTIVE";

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "salary")
    private BigDecimal salary;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @ElementCollection
    @CollectionTable(name = "employee_leave_balances",
        joinColumns = @JoinColumn(name = "employee_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @Column(name = "balance")
    private Map<LeaveType, BigDecimal> leaveBalances = new HashMap<>();
}
