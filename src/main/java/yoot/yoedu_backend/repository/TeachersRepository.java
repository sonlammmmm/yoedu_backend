package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Teacher;

public interface TeachersRepository extends JpaRepository<Teacher, Long> {
}
