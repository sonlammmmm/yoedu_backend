package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
