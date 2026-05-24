package yoot.yoedu_backend.repository;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Attendance;

import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByCourseClassIdAndStudentIdAndAttendanceDate(Long courseClassId, Long studentId, @NotNull LocalDate attendanceDate);

    java.util.List<Attendance> findByCourseClassId(Long courseClassId);
    java.util.List<Attendance> findByStudentId(Long studentId);
}
