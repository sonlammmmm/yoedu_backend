import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { PromotionResponse, PromotionUpsertRequest } from '../../../types/yoedu';

const promotionSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().min(1, 'Description is required'),
  discountType: z.enum(['PERCENTAGE', 'FIXED', 'PERCENT', 'AMOUNT']),
  discountValue: z.number().min(0, 'Cannot be negative'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean(),
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: PromotionResponse | null;
  onSubmit: (data: PromotionUpsertRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  isOpen, onClose, promotion, onSubmit, isSubmitting
}) => {
  const isEditing = !!promotion;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    }
  });

  useEffect(() => {
    if (promotion) {
      reset({
        code: promotion.code,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        startDate: promotion.startDate.split('T')[0], // Extract YYYY-MM-DD
        endDate: promotion.endDate.split('T')[0],
        isActive: promotion.isActive,
      });
    } else {
      reset({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
  }, [promotion, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Promotion' : 'Add New Promotion'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Promotion Code" required error={errors.code}>
            <input
              type="text"
              {...register('code')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all uppercase"
            />
          </FormField>

          <FormField label="Status" required>
            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Is Active</span>
              </label>
            </div>
          </FormField>
        </div>

        <FormField label="Description" required error={errors.description}>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Discount Type" required error={errors.discountType}>
            <select
              {...register('discountType')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (VND)</option>
            </select>
          </FormField>

          <FormField label="Discount Value" required error={errors.discountValue}>
            <input
              type="number"
              {...register('discountValue', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Start Date" required error={errors.startDate}>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="End Date" required error={errors.endDate}>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
