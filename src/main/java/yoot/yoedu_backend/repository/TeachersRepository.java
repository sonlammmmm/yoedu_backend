package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Teachers;

public interface TeachersRepository extends JpaRepository<Teachers, Long> {
}
