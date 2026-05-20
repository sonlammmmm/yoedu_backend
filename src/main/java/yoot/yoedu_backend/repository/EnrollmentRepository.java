package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
}
