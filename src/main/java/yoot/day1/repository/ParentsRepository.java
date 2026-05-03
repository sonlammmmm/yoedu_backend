package yoot.day1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.day1.domain.entity.Parents;

public interface ParentsRepository extends JpaRepository<Parents, Long> {
}
