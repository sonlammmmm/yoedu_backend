package yoot.yoedu_backend.repository;

import yoot.yoedu_backend.domain.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    
}
