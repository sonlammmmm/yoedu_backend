import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { RoomResponse, RoomUpsertRequest } from '../../types/yoedu';

export const roomsApi = {
  getAll: (keyword?: string): Promise<RoomResponse[]> => {
    return api.get('/api/rooms', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<RoomResponse> => {
    return api.get(`/api/rooms/${id}`);
  },
  create: (data: RoomUpsertRequest): Promise<RoomResponse> => {
    return api.post('/api/rooms', data);
  },
  update: (id: number, data: RoomUpsertRequest): Promise<RoomResponse> => {
    return api.put(`/api/rooms/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/rooms/${id}`);
  }
};
