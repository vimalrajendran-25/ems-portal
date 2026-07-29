package com.ems.config;

import com.ems.entity.*;
import com.ems.entity.enums.LeaveStatus;
import com.ems.entity.enums.LeaveType;
import com.ems.entity.enums.RoleType;
import com.ems.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeedDataConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database already seeded");
            return;
        }

        log.info("Seeding database...");

        for (RoleType roleType : RoleType.values()) {
            Role role = new Role();
            role.setName(roleType);
            role.setDescription(roleType.name().replace("_", " ").toLowerCase());
            roleRepository.save(role);
        }

        Department engineering = createDepartment("Engineering", "ENG");
        Department hr = createDepartment("Human Resources", "HR");
        Department finance = createDepartment("Finance", "FIN");
        Department marketing = createDepartment("Marketing", "MKT");
        Department operations = createDepartment("Operations", "OPS");
        Department sales = createDepartment("Sales", "SALES");

        User adminUser = createUser("Super", "Admin", "admin@ems.com", "Admin@123", true,
                Set.of(RoleType.SUPER_ADMIN, RoleType.HR_ADMIN));
        User hrUser = createUser("Sarah", "Johnson", "hr@ems.com", "Admin@123", true,
                Set.of(RoleType.HR_ADMIN));
        User empUser = createUser("John", "Doe", "john@ems.com", "Admin@123", true,
                Set.of(RoleType.EMPLOYEE));
        User tlUser = createUser("Mike", "Wilson", "mike@ems.com", "Admin@123", true,
                Set.of(RoleType.TEAM_LEAD));

        Employee adminEmp = createEmployee("EMS001", adminUser, "System Administrator", engineering, null, BigDecimal.valueOf(150000));
        Employee hrEmp = createEmployee("EMS002", hrUser, "HR Manager", hr, null, BigDecimal.valueOf(120000));
        Employee tlEmp = createEmployee("EMS003", tlUser, "Tech Lead", engineering, adminEmp, BigDecimal.valueOf(100000));
        Employee emp1 = createEmployee("EMS004", empUser, "Software Engineer", engineering, tlEmp, BigDecimal.valueOf(75000));

        Employee emp2User = createEmployeeUser("Jane", "Smith", "jane@ems.com", "Software Engineer", engineering, tlEmp, BigDecimal.valueOf(70000));
        Employee emp3User = createEmployeeUser("Bob", "Brown", "bob@ems.com", "Senior Developer", engineering, tlEmp, BigDecimal.valueOf(90000));
        Employee emp4User = createEmployeeUser("Alice", "Davis", "alice@ems.com", "HR Executive", hr, hrEmp, BigDecimal.valueOf(55000));

        createLeaveRequest(emp1, LeaveType.SICK_LEAVE, LeaveStatus.APPROVED, LocalDate.now().minusDays(10), LocalDate.now().minusDays(8), 3, hrEmp);
        createLeaveRequest(emp1, LeaveType.CASUAL_LEAVE, LeaveStatus.PENDING, LocalDate.now().plusDays(5), LocalDate.now().plusDays(6), 2, null);
        createLeaveRequest(emp2User, LeaveType.EARNED_LEAVE, LeaveStatus.APPROVED, LocalDate.now().minusDays(20), LocalDate.now().minusDays(18), 3, hrEmp);
        createLeaveRequest(emp3User, LeaveType.SICK_LEAVE, LeaveStatus.PENDING, LocalDate.now().plusDays(2), LocalDate.now().plusDays(3), 2, null);

        log.info("Database seeded successfully");
    }

    private Department createDepartment(String name, String code) {
        Department dept = new Department();
        dept.setName(name);
        dept.setCode(code);
        return departmentRepository.save(dept);
    }

    private User createUser(String firstName, String lastName, String email, String password, boolean isActive, Set<RoleType> roleTypes) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsActive(isActive);
        Set<Role> roles = new HashSet<>();
        roleTypes.forEach(rt -> roleRepository.findByName(rt).ifPresent(roles::add));
        user.setRoles(roles);
        return userRepository.save(user);
    }

    private Employee createEmployee(String empId, User user, String designation, Department dept, Employee manager, BigDecimal salary) {
        Employee emp = new Employee();
        emp.setEmployeeId(empId);
        emp.setUser(user);
        emp.setDesignation(designation);
        emp.setDepartment(dept);
        emp.setManager(manager);
        emp.setSalary(salary);
        emp.setDateOfJoining(LocalDate.of(2024, 1, 15));
        emp.setStatus("ACTIVE");
        emp.setPhone("+1-555-0100");
        emp.setAddress("123 Main St, New York, NY");
        emp.setLeaveBalances(createDefaultLeaveBalances());
        return employeeRepository.save(emp);
    }

    private Employee createEmployeeUser(String firstName, String lastName, String email, String designation, Department dept, Employee manager, BigDecimal salary) {
        User user = createUser(firstName, lastName, email, "Admin@123", true, Set.of(RoleType.EMPLOYEE));
        String empId = "EMS" + String.format("%03d", employeeRepository.count() + 1);
        return createEmployee(empId, user, designation, dept, manager, salary);
    }

    private Map<LeaveType, BigDecimal> createDefaultLeaveBalances() {
        Map<LeaveType, BigDecimal> balances = new HashMap<>();
        balances.put(LeaveType.SICK_LEAVE, new BigDecimal("12"));
        balances.put(LeaveType.CASUAL_LEAVE, new BigDecimal("12"));
        balances.put(LeaveType.EARNED_LEAVE, new BigDecimal("15"));
        balances.put(LeaveType.MATERNITY_LEAVE, new BigDecimal("180"));
        balances.put(LeaveType.PATERNITY_LEAVE, new BigDecimal("15"));
        balances.put(LeaveType.COMP_OFF, new BigDecimal("0"));
        return balances;
    }

    private void createLeaveRequest(Employee emp, LeaveType type, LeaveStatus status, LocalDate start, LocalDate end, int days, Employee approvedBy) {
        LeaveRequest lr = new LeaveRequest();
        lr.setEmployee(emp);
        lr.setLeaveType(type);
        lr.setStatus(status);
        lr.setStartDate(start);
        lr.setEndDate(end);
        lr.setTotalDays(days);
        lr.setReason("Leave request for " + type.name().toLowerCase().replace("_", " "));
        lr.setApprovedBy(approvedBy);
        lr.setApprovedAt(approvedBy != null ? LocalDate.now() : null);
        leaveRequestRepository.save(lr);
    }
}
