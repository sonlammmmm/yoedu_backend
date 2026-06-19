package yoot.yoedu_backend.repository;

import yoot.yoedu_backend.domain.entity.RefreshTokenSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenSessionRepository extends JpaRepository<RefreshTokenSession, Long> {

  Optional<RefreshTokenSession> findByJti(String jti);

  List<RefreshTokenSession> findByUserIdAndRevokedAtIsNull(Long userId);

  List<RefreshTokenSession> findByExpiresAtBeforeAndRevokedAtIsNull(Instant now);
}
