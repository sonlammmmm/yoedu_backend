package yoot.yoedu_backend.repository;

import yoot.yoedu_backend.domain.entity.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {
    
}
