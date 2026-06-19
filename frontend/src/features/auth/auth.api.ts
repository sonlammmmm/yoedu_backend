import { api } from '../../lib/api';
import type { AuthResponse, CurrentUser } from '../../types/api';
export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    // For demo purposes if API is not yet ready, simulate login
    if (credentials.username === 'admin' && credentials.password === '123456') {
      return {
        accessToken: 'demo-token-12345',
        refreshToken: 'demo-refresh-token',
        user: {
          id: 1,
          username: 'admin',
          fullName: 'System Admin',
          role: 'ADMIN',
          isActive: true
        }
      };
    }
    
    // Real API Call
    return api.post('/api/auth/login', credentials);
  },
  me: async (): Promise<CurrentUser> => {
    return api.get('/api/auth/me');
  }
};