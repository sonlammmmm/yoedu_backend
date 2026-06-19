import { api } from '../../lib/api';
import type { EnrollmentResponse, EnrollmentCreateRequest } from '../../types/yoedu';

export const enrollmentsApi = {
  create: (data: EnrollmentCreateRequest): Promise<EnrollmentResponse> => {
    return api.post('/api/enrollments', data);
  },
  getByClassId: (classId: number): Promise<EnrollmentResponse[]> => {
    return api.get(`/api/enrollments/class/${classId}`);
  },
  getByStudentId: (studentId: number): Promise<EnrollmentResponse[]> => {
    return api.get(`/api/enrollments/student/${studentId}`);
  }
};
