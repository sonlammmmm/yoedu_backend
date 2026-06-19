import { api } from '../../lib/api';
import { cleanParams } from '../../utils/apiUtils';
import type { PromotionResponse, PromotionUpsertRequest } from '../../types/yoedu';

export const promotionsApi = {
  getAll: (keyword?: string): Promise<PromotionResponse[]> => {
    return api.get('/api/promotions', { params: cleanParams({ keyword }) });
  },
  getById: (id: number): Promise<PromotionResponse> => {
    return api.get(`/api/promotions/${id}`);
  },
  create: (data: PromotionUpsertRequest): Promise<PromotionResponse> => {
    return api.post('/api/promotions', data);
  },
  update: (id: number, data: PromotionUpsertRequest): Promise<PromotionResponse> => {
    return api.put(`/api/promotions/${id}`, data);
  },
  delete: (id: number): Promise<void> => {
    return api.delete(`/api/promotions/${id}`);
  }
};
