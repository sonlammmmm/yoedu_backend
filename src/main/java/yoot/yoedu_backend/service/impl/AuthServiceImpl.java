package yoot.yoedu_backend.service.impl;

import yoot.yoedu_backend.common.exception.BadRequestException;
import yoot.yoedu_backend.common.exception.NotFoundException;
import yoot.yoedu_backend.config.AppJwtProperties;
import yoot.yoedu_backend.domain.entity.RefreshTokenSession;
import yoot.yoedu_backend.domain.entity.User;
import yoot.yoedu_backend.dto.auth.AuthResponse;
import yoot.yoedu_backend.dto.auth.ChangePasswordRequest;
import yoot.yoedu_backend.dto.auth.CurrentUserResponse;
import yoot.yoedu_backend.dto.auth.LoginRequest;
import yoot.yoedu_backend.dto.auth.RefreshTokenRequest;
import yoot.yoedu_backend.repository.RefreshTokenSessionRepository;
import yoot.yoedu_backend.repository.UserRepository;
import yoot.yoedu_backend.security.JwtService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import yoot.yoedu_backend.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenSessionRepository refreshTokenSessionRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AppJwtProperties jwtProperties;

  @Override
  @Transactional
  public AuthResponse login(LoginRequest request) {
    User user = userRepository
        .findByUsername(request.username())
        .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
    return buildTokensForUser(user, request.password());
  }

  @Override
  @Transactional
  public AuthResponse refresh(RefreshTokenRequest request) {
    String username;
    String currentJti;
    try {
      if (!jwtService.isRefreshToken(request.refreshToken())) {
        throw new BadCredentialsException("Invalid refresh token");
      }
      username = jwtService.extractUsername(request.refreshToken());
      currentJti = jwtService.extractJti(request.refreshToken());
      Instant refreshExpiresAt = jwtService.extractExpiration(request.refreshToken());
      if (refreshExpiresAt == null) {
        throw new BadCredentialsException("Invalid refresh token");
      }
    } catch (JwtException | IllegalArgumentException ex) {
      throw new BadCredentialsException("Invalid refresh token");
    }

    if (currentJti == null || currentJti.isBlank()) {
      throw new BadCredentialsException("Invalid refresh token");
    }

    User user = userRepository
        .findByUsername(username)
        .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

    if (!Boolean.TRUE.equals(user.getIsActive())) {
      throw new BadCredentialsException("Invalid refresh token");
    }

    RefreshTokenSession currentSession = refreshTokenSessionRepository
        .findByJti(currentJti)
        .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

    if (currentSession.getUser().getId() != user.getId()) {
      throw new BadCredentialsException("Invalid refresh token");
    }

    Instant now = Instant.now();
    if (currentSession.getRevokedAt() != null || !currentSession.getExpiresAt().isAfter(now)) {
      throw new BadCredentialsException("Invalid refresh token");
    }

    Instant accessExpiresAt = now.plusSeconds(jwtProperties.accessTokenTtlMinutes() * 60);
    Instant nextRefreshExpiresAt = now.plusSeconds(jwtProperties.refreshTokenTtlDays() * 24 * 60 * 60);

    String nextRefreshJti = jwtService.generateJti();
    String accessToken = jwtService.generateAccessToken(user, now, accessExpiresAt);
    String refreshToken = jwtService.generateRefreshToken(user, nextRefreshJti, now, nextRefreshExpiresAt);

    currentSession.setRevokedAt(now);
    currentSession.setReplacedByJti(nextRefreshJti);
    refreshTokenSessionRepository.save(currentSession);

    RefreshTokenSession nextSession = new RefreshTokenSession();
    nextSession.setJti(nextRefreshJti);
    nextSession.setUser(user);
    nextSession.setExpiresAt(nextRefreshExpiresAt);
    refreshTokenSessionRepository.save(nextSession);

    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        accessExpiresAt,
        nextRefreshExpiresAt,
        toCurrentUserResponse(user));
  }

  @Override
  @Transactional
  public void changePassword(String username, ChangePasswordRequest request) {
    User user = findActiveUserByUsername(username);

    if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
      throw new BadRequestException("Current password is incorrect");
    }

    if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
      throw new BadRequestException("New password must be different from current password");
    }

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));

    revokeAllActiveRefreshTokens(user.getId());
  }

  @Override
  @Transactional(readOnly = true)
  public CurrentUserResponse me(String username) {
    return toCurrentUserResponse(findActiveUserByUsername(username));
  }

  @Override
  @Transactional(readOnly = true)
  public User findActiveUserByUsername(String username) {
    User user = userRepository
        .findByUsername(username)
        .orElseThrow(() -> new NotFoundException("User not found"));
    if (!Boolean.TRUE.equals(user.getIsActive())) {
      throw new BadRequestException("User is inactive");
    }
    return user;
  }

  private AuthResponse buildTokensForUser(User user, String rawPassword) {
    if (!Boolean.TRUE.equals(user.getIsActive())) {
      throw new BadCredentialsException("User is inactive");
    }

    if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
      throw new BadCredentialsException("Invalid credentials");
    }

    Instant now = Instant.now();
    Instant accessExpiresAt = now.plusSeconds(jwtProperties.accessTokenTtlMinutes() * 60);
    Instant refreshExpiresAt = now.plusSeconds(jwtProperties.refreshTokenTtlDays() * 24 * 60 * 60);
    String refreshJti = jwtService.generateJti();

    String accessToken = jwtService.generateAccessToken(user, now, accessExpiresAt);
    String refreshToken = jwtService.generateRefreshToken(user, refreshJti, now, refreshExpiresAt);

    RefreshTokenSession refreshTokenSession = new RefreshTokenSession();
    refreshTokenSession.setJti(refreshJti);
    refreshTokenSession.setUser(user);
    refreshTokenSession.setExpiresAt(refreshExpiresAt);
    refreshTokenSessionRepository.save(refreshTokenSession);

    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        accessExpiresAt,
        refreshExpiresAt,
        toCurrentUserResponse(user));
  }

  private void revokeAllActiveRefreshTokens(Long userId) {
    Instant now = Instant.now();
    List<RefreshTokenSession> activeSessions = refreshTokenSessionRepository.findByUserIdAndRevokedAtIsNull(userId);
    for (RefreshTokenSession session : activeSessions) {
      if (session.getExpiresAt().isAfter(now)) {
        session.setRevokedAt(now);
      }
    }
    refreshTokenSessionRepository.saveAll(activeSessions);
  }

  private CurrentUserResponse toCurrentUserResponse(User user) {
    return new CurrentUserResponse(
        user.getId(),
        user.getUsername(),
        user.getFullName(),
        user.getRole().name(),
        user.getParent() != null ? user.getParent().getId() : null,
        user.getTeacher() != null ? user.getTeacher().getId() : null);
  }
}
