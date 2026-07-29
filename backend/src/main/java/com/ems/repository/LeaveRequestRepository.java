package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import com.ems.entity.enums.LeaveStatus;
import com.ems.entity.enums.LeaveType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    Page<LeaveRequest> findByEmployeeId(Long employeeId, Pageable pageable);

    Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);

    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
           "(:status IS NULL OR lr.status = :status) AND " +
           "(:employeeId IS NULL OR lr.employee.id = :employeeId)")
    Page<LeaveRequest> filterLeaves(@Param("status") LeaveStatus status,
                                    @Param("employeeId") Long employeeId,
                                    Pageable pageable);

    List<LeaveRequest> findByEmployeeAndLeaveTypeAndStartDateBetween(
        Employee employee, LeaveType leaveType, LocalDate start, LocalDate end);

    long countByStatus(LeaveStatus status);

    @Query("SELECT lr.leaveType, COUNT(lr) FROM LeaveRequest lr GROUP BY lr.leaveType")
    List<Object[]> countByLeaveType();
}
