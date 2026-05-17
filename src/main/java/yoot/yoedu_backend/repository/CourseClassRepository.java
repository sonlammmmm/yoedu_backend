package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.CourseClass;

public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {

}
