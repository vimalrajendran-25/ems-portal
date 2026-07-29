package com.ems.service;

import com.ems.dto.request.EmployeeRequest;
import com.ems.dto.response.EmployeeResponse;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.entity.enums.LeaveType;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public Page<EmployeeResponse> getAllEmployees(String search, Pageable pageable) {
        Page<Employee> employees;
        if (search != null && !search.isEmpty()) {
            employees = employeeRepository.searchEmployees(search, pageable);
        } else {
            employees = employeeRepository.findAll(pageable);
        }
        return employees.map(this::toResponse);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return toResponse(employee);
    }

    public EmployeeResponse getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));
        return toResponse(employee);
    }

    public EmployeeResponse getEmployeeByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "employeeId", employeeId));
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (employeeRepository.findByEmployeeId(request.getEmployeeId()).isPresent()) {
            throw new IllegalArgumentException("Employee ID already exists");
        }

        Employee employee = new Employee();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setUser(user);
        employee.setDesignation(request.getDesignation());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDateOfJoining(request.getDateOfJoining());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setStatus("ACTIVE");
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setSalary(request.getSalary());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            employee.setDepartment(dept);
            dept.setHeadCount(dept.getHeadCount() + 1);
            departmentRepository.save(dept);
        }

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.getManagerId()));
            employee.setManager(manager);
        }

        Map<LeaveType, BigDecimal> balances = new HashMap<>();
        balances.put(LeaveType.SICK_LEAVE, new BigDecimal("12"));
        balances.put(LeaveType.CASUAL_LEAVE, new BigDecimal("12"));
        balances.put(LeaveType.EARNED_LEAVE, new BigDecimal("15"));
        balances.put(LeaveType.MATERNITY_LEAVE, new BigDecimal("180"));
        balances.put(LeaveType.PATERNITY_LEAVE, new BigDecimal("15"));
        balances.put(LeaveType.COMP_OFF, new BigDecimal("0"));
        employee.setLeaveBalances(balances);

        employee = employeeRepository.save(employee);
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employee.setDesignation(request.getDesignation());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDateOfJoining(request.getDateOfJoining());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setSalary(request.getSalary());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            if (employee.getDepartment() != null && !employee.getDepartment().getId().equals(dept.getId())) {
                Department oldDept = employee.getDepartment();
                oldDept.setHeadCount(oldDept.getHeadCount() - 1);
                departmentRepository.save(oldDept);
                dept.setHeadCount(dept.getHeadCount() + 1);
                departmentRepository.save(dept);
            }
            employee.setDepartment(dept);
        }

        employee = employeeRepository.save(employee);
        return toResponse(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employee.setIsDeleted(true);
        employeeRepository.save(employee);
    }

    private EmployeeResponse toResponse(Employee emp) {
        return EmployeeResponse.builder()
                .id(emp.getId())
                .employeeId(emp.getEmployeeId())
                .firstName(emp.getUser().getFirstName())
                .lastName(emp.getUser().getLastName())
                .email(emp.getUser().getEmail())
                .phone(emp.getPhone())
                .designation(emp.getDesignation())
                .department(emp.getDepartment() != null ? emp.getDepartment().getName() : null)
                .departmentId(emp.getDepartment() != null ? emp.getDepartment().getId() : null)
                .managerName(emp.getManager() != null
                        ? emp.getManager().getUser().getFirstName() + " " + emp.getManager().getUser().getLastName()
                        : null)
                .dateOfJoining(emp.getDateOfJoining())
                .dateOfBirth(emp.getDateOfBirth())
                .employmentType(emp.getEmploymentType())
                .status(emp.getStatus())
                .address(emp.getAddress())
                .salary(emp.getSalary())
                .emergencyContactName(emp.getEmergencyContactName())
                .emergencyContactPhone(emp.getEmergencyContactPhone())
                .profileImageUrl(emp.getProfileImageUrl())
                .createdAt(emp.getCreatedAt())
                .build();
    }
}
