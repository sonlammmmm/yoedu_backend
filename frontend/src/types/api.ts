export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type UserRole = 'ADMIN' | 'ACADEMIC_STAFF' | 'CASHIER' | 'PARENT';

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
}
