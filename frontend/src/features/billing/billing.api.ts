import { api } from '../../lib/api';
import type { InvoiceResponse, InvoiceCreateRequest } from '../../types/yoedu';

export const billingApi = {
  createInvoice: (data: InvoiceCreateRequest): Promise<InvoiceResponse> => {
    return api.post('/api/billing/invoices', data);
  },
  getInvoicesByStudentId: (studentId: number): Promise<InvoiceResponse[]> => {
    return api.get(`/api/billing/students/${studentId}/invoices`);
  }
  // Note: /api/billing/payments is handled in payments.api.ts or could be here
};
