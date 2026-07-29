package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeId(String employeeId);
    Optional<Employee> findByUserId(Long userId);

    Page<Employee> findByStatus(String status, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.user.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.user.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> searchEmployees(@Param("search") String search, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.department.id = :deptId")
    Page<Employee> findByDepartmentId(@Param("deptId") Long deptId, Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE'")
    long countActiveEmployees();

    @Query("SELECT e.department.name, COUNT(e) FROM Employee e GROUP BY e.department.name")
    java.util.List<Object[]> countByDepartment();
}
