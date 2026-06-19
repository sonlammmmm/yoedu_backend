import { api } from '../../lib/api';
import type { TeacherResponse, RoomResponse, ScheduleSlotResponse, PromotionResponse } from '../../types/yoedu';

export const referenceApi = {
  getTeachers: (): Promise<TeacherResponse[]> => {
    return api.get('/api/reference/teachers');
  },
  getRooms: (): Promise<RoomResponse[]> => {
    return api.get('/api/reference/rooms');
  },
  getScheduleSlots: (): Promise<ScheduleSlotResponse[]> => {
    return api.get('/api/reference/schedule-slots');
  },
  getPromotions: (): Promise<PromotionResponse[]> => {
    return api.get('/api/reference/promotions');
  }
};
