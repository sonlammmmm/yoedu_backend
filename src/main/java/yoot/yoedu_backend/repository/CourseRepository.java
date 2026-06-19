package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import yoot.yoedu_backend.domain.entity.Course;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT o FROM Course o WHERE o.isActive")
    List<Course> findByCourseActive();
}
