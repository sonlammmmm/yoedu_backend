package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.User;
import yoot.yoedu_backend.dto.auth.AuthResponse;
import yoot.yoedu_backend.dto.auth.ChangePasswordRequest;
import yoot.yoedu_backend.dto.auth.CurrentUserResponse;
import yoot.yoedu_backend.dto.auth.LoginRequest;
import yoot.yoedu_backend.dto.auth.RefreshTokenRequest;

public interface AuthService {
  AuthResponse login(LoginRequest request);

  AuthResponse refresh(RefreshTokenRequest request);

  void changePassword(String username, ChangePasswordRequest request);

  CurrentUserResponse me(String username);

  User findActiveUserByUsername(String username);
}
