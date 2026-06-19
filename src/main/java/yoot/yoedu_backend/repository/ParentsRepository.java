package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Parents;

public interface ParentsRepository extends JpaRepository<Parents, Long> {
}
