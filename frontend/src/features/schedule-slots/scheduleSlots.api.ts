import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { ScheduleSlotResponse, ScheduleSlotUpsertRequest } from '../../types/yoedu';

export const scheduleSlotsApi = {
  getAll: (keyword?: string): Promise<ScheduleSlotResponse[]> => {
    return api.get('/api/schedule-slots', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<ScheduleSlotResponse> => {
    return api.get(`/api/schedule-slots/${id}`);
  },
  create: (data: ScheduleSlotUpsertRequest): Promise<ScheduleSlotResponse> => {
    return api.post('/api/schedule-slots', data);
  },
  update: (id: number, data: ScheduleSlotUpsertRequest): Promise<ScheduleSlotResponse> => {
    return api.put(`/api/schedule-slots/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/schedule-slots/${id}`);
  }
};
