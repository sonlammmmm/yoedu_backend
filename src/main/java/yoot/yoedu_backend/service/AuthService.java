package yoot.yoedu_backend.service;

import yoot.yoedu_backend.domain.entity.User;
import yoot.yoedu_backend.dto.auth.AuthResponse;
import yoot.yoedu_backend.dto.auth.ChangePasswordRequest;
import yoot.yoedu_backend.dto.auth.CurrentUserResponse;
import yoot.yoedu_backend.dto.auth.LoginRequest;
import yoot.yoedu_backend.dto.auth.RefreshTokenRequest;

import yoot.yoedu_backend.common.exception.ConflictException;
import yoot.yoedu_backend.dto.auth.UserRegisterRequest;

public interface AuthService {
  void register(UserRegisterRequest request) throws ConflictException;

  AuthResponse login(LoginRequest request);

  AuthResponse refresh(RefreshTokenRequest request);

  void changePassword(String username, ChangePasswordRequest request);

  CurrentUserResponse me(String username);

  User findActiveUserByUsername(String username);
}
