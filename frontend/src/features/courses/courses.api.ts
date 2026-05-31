import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { CourseResponse, CourseUpsertRequest } from '../../types/yoedu';

export const coursesApi = {
  getAll: (keyword?: string): Promise<CourseResponse[]> => {
    return api.get('/api/courses', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<CourseResponse> => {
    return api.get(`/api/courses/${id}`);
  },
  create: (data: CourseUpsertRequest): Promise<CourseResponse> => {
    return api.post('/api/courses', data);
  },
  update: (id: number, data: CourseUpsertRequest): Promise<CourseResponse> => {
    return api.put(`/api/courses/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/courses/${id}`);
  }
};
