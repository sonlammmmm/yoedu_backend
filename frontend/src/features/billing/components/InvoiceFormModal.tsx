import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { InvoiceCreateRequest } from '../../../types/yoedu';

import { studentsApi } from '../../students/students.api';
import { courseClassesApi } from '../../courses/courseClasses.api';
import { promotionsApi } from '../../promotions/promotions.api';

const invoiceSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  classId: z.number().min(1, 'Class is required'),
  promotionId: z.number().optional(),
  billingMonth: z.string().min(1, 'Month is required'), // YYYY-MM
  amount: z.number().min(0, 'Amount cannot be negative'),
  discountAmount: z.number().min(0).optional(),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen, onClose, onSubmit, isSubmitting
}) => {
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: () => studentsApi.getAll() });
  const { data: classes } = useQuery({ queryKey: ['course-classes'], queryFn: () => courseClassesApi.getAll() });
  const { data: promotions } = useQuery({ queryKey: ['promotions'], queryFn: () => promotionsApi.getAll() });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      studentId: 0,
      classId: 0,
      billingMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
      amount: 0,
      discountAmount: 0,
      dueDate: '',
      note: '',
    }
  });

  const selectedClassId = watch('classId');
  const selectedPromotionId = watch('promotionId');
  const currentAmount = watch('amount');

  // Auto-fill amount based on class tuition fee
  useEffect(() => {
    if (selectedClassId && classes) {
      const cls = classes.find(c => c.id === selectedClassId);
      if (cls) {
        setValue('amount', cls.tuitionFee);
      }
    }
  }, [selectedClassId, classes, setValue]);

  // Auto-calculate discount based on promotion
  useEffect(() => {
    if (selectedPromotionId && promotions && currentAmount > 0) {
      const promo = promotions.find(p => p.id === selectedPromotionId);
      if (promo) {
        if (promo.discountType === 'PERCENTAGE' || promo.discountType === 'PERCENT') {
          setValue('discountAmount', Math.round(currentAmount * promo.discountValue / 100));
        } else {
          setValue('discountAmount', promo.discountValue);
        }
      }
    } else {
      setValue('discountAmount', 0);
    }
  }, [selectedPromotionId, promotions, currentAmount, setValue]);

  const handleFormSubmit = async (data: InvoiceFormValues) => {
    const payload: InvoiceCreateRequest = {
      studentId: data.studentId,
      amount: data.amount,
      discountAmount: data.discountAmount,
      dueDate: data.dueDate || new Date().toISOString().split('T')[0], // default to today if missing
      note: data.note,
      classId: data.classId,
      billingMonth: `${data.billingMonth}-01`, // Format as YYYY-MM-01 per requirement
    };
    await onSubmit(payload);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        studentId: 0,
        classId: 0,
        billingMonth: new Date().toISOString().slice(0, 7),
        amount: 0,
        discountAmount: 0,
        dueDate: '',
        note: '',
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Invoice" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Student" required error={errors.studentId}>
            <select
              {...register('studentId', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value={0} disabled>Select a student...</option>
              {students?.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Class" required error={errors.classId}>
            <select
              {...register('classId', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value={0} disabled>Select a class...</option>
              {classes?.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.courseName})</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Billing Month" required error={errors.billingMonth}>
            <input
              type="month"
              {...register('billingMonth')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Promotion" error={errors.promotionId}>
            <select
              {...register('promotionId', { valueAsNumber: true, setValueAs: v => v ? Number(v) : undefined })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">None</option>
              {promotions?.filter(p => p.isActive).map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.description}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Amount (VND)" required error={errors.amount}>
            <input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Discount (VND)" error={errors.discountAmount}>
            <input
              type="number"
              {...register('discountAmount', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Due Date" error={errors.dueDate}>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <FormField label="Note" error={errors.note}>
          <textarea
            {...register('note')}
            rows={2}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Invoice details..."
          />
        </FormField>

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
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
