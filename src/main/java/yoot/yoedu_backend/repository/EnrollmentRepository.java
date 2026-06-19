package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Enrollment;
import yoot.yoedu_backend.domain.enums.EnrollmentStatus;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    long countByCourseClassIdAndStatus(Long courseClassId, EnrollmentStatus status);

    java.util.List<Enrollment> findByCourseClassId(Long courseClassId);

    java.util.Optional<Enrollment> findByStudentIdAndCourseClassId(Long studentId, Long courseClassId);

    java.util.List<Enrollment> findByStudentId(Long studentId);
}
