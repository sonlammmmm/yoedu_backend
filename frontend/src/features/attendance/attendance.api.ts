import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { AttendanceResponse, AttendanceCreateRequest, AttendanceBatchRequest } from '../../types/yoedu';

export const attendanceApi = {
  create: (data: AttendanceCreateRequest): Promise<AttendanceResponse> => {
    return api.post('/api/attendances', data);
  },
  createBatch: (data: AttendanceBatchRequest): Promise<AttendanceResponse[]> => {
    return api.post('/api/attendances/batch', data);
  },
  getByClassId: (classId: number, attendanceDate?: string): Promise<AttendanceResponse[]> => {
    return api.get(`/api/attendances/class/${classId}`, { params: cleanParams({ attendanceDate }) });
  },
  getMatrixByClassId: (classId: number): Promise<unknown[]> => {
    return api.get(`/api/attendances/matrix/${classId}`);
  }
};
