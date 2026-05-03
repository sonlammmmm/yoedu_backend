package yoot.day1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.day1.domain.entity.Teachers;

public interface TeachersRepository extends JpaRepository<Teachers, Long> {
}
