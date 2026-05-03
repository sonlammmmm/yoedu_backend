package yoot.day1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.day1.domain.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
