package yoot.day1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.day1.domain.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

}
