package yoot.yoedu_backend.repository;

import org.springframework.data.repository.CrudRepository;
import yoot.yoedu_backend.domain.entity.Promotion;

public interface PromotionRepository extends CrudRepository<Promotion, Long> {
}
