package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.LearningResult;

import java.time.LocalDate;
import java.util.List;

public interface LearningResultRepository extends JpaRepository<LearningResult,Long> {
    boolean existsByStudentIdAndCourseClassIdAndResultMonth(Long studentId, Long courseClassId, LocalDate resultMonth);

    List<LearningResult> findByStudentId(Long studentId);
}
