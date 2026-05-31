import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { CourseClassResponse, CourseClassCreateRequest } from '../../types/yoedu';

export const courseClassesApi = {
  getAll: (keyword?: string): Promise<CourseClassResponse[]> => {
    return api.get('/api/course-classes', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<CourseClassResponse> => {
    return api.get(`/api/course-classes/${id}`);
  },
  getByCourseId: (courseId: number): Promise<CourseClassResponse[]> => {
    return api.get(`/api/course-classes/course/${courseId}`);
  },
  create: (data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
    return api.post('/api/course-classes', data);
  },
  update: (id: number, data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
    return api.put(`/api/course-classes/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/course-classes/${id}`);
  }
};
