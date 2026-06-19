import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { TeacherResponse, TeacherUpsertRequest } from '../../types/yoedu';

export const teachersApi = {
  getAll: (keyword?: string): Promise<TeacherResponse[]> => {
    return api.get('/api/teachers', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<TeacherResponse> => {
    return api.get(`/api/teachers/${id}`);
  },
  create: (data: TeacherUpsertRequest): Promise<TeacherResponse> => {
    return api.post('/api/teachers', data);
  },
  update: (id: number, data: TeacherUpsertRequest): Promise<TeacherResponse> => {
    return api.put(`/api/teachers/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/teachers/${id}`);
  }
};
