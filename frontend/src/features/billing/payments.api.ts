import { api } from '../../lib/api';
import type { PaymentResponse, PaymentCreateRequest } from '../../types/yoedu';

export const paymentsApi = {
  create: (data: PaymentCreateRequest): Promise<PaymentResponse> => {
    // The prompt listed POST /api/billing/payments under Billing, but we handle it here
    return api.post('/api/billing/payments', data);
  },
  getAll: (): Promise<PaymentResponse[]> => {
    return api.get('/api/payments/all');
  },
  getById: (id: number): Promise<PaymentResponse> => {
    return api.get(`/api/payments/${id}`);
  },
  getByStudentId: (studentId: number): Promise<PaymentResponse[]> => {
    return api.get(`/api/payments/student/${studentId}`);
  }
};
