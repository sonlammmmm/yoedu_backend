package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

}
