import { api } from '../../lib/api';
import type { DashboardStatsResponse, MonthlyRevenueDto, CourseRevenueDto } from '../../types/yoedu';

export const reportsApi = {
  getDashboardStats: (): Promise<DashboardStatsResponse> => {
    return api.get('/api/reports/dashboard-stats');
  },
  getMonthlyRevenue: (year: number): Promise<MonthlyRevenueDto[]> => {
    return api.get(`/api/reports/revenue/monthly?year=${year}`);
  },
  getCourseRevenue: (year: number, month?: number): Promise<CourseRevenueDto[]> => {
    let url = `/api/reports/revenue/course?year=${year}`;
    if (month !== undefined) {
      url += `&month=${month}`;
    }
    return api.get(url);
  }
};
