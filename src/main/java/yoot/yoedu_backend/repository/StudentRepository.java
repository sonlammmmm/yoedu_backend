package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    java.util.List<Student> findByParentsId(Long parentId);
}
