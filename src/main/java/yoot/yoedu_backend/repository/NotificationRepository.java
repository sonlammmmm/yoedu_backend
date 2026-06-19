package yoot.yoedu_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yoot.yoedu_backend.domain.entity.Notification;
import yoot.yoedu_backend.domain.enums.NotificationRecipientType;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientTypeAndRecipientRefIdOrderByCreatedAtDesc(NotificationRecipientType recipientType, Long recipientRefId);
}
