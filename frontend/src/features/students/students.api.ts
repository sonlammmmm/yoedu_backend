import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { StudentResponse, StudentUpsertRequest, StudentWithParentUpsertRequest } from '../../types/yoedu';

export const studentsApi = {
  getAll: (keyword?: string): Promise<StudentResponse[]> => {
    return api.get('/api/students', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<StudentResponse> => {
    return api.get(`/api/students/${id}`);
  },
  create: (data: StudentUpsertRequest): Promise<StudentResponse> => {
    return api.post('/api/students', data);
  },
  createWithParent: (data: StudentWithParentUpsertRequest): Promise<StudentResponse> => {
    return api.post('/api/students/with-parent', data);
  },
  update: (id: number, data: StudentUpsertRequest): Promise<StudentResponse> => {
    return api.put(`/api/students/${id}`, data);
  },
  updateWithParent: (id: number, data: StudentWithParentUpsertRequest): Promise<StudentResponse> => {
    return api.put(`/api/students/${id}/with-parent`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/students/${id}`);
  }
};
