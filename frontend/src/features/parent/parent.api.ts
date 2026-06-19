import { api } from '../../lib/api';
import type { ParentDashboardResponse } from '../../types/yoedu';

export const parentApi = {
  getDashboard: (): Promise<ParentDashboardResponse> => {
    return api.get('/api/parent/dashboard');
  }
};
