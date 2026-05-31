import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { PaymentCreateRequest } from '../../../types/yoedu';

import { studentsApi } from '../../students/students.api';
import { billingApi } from '../billing.api';
import { formatCurrencyVND } from '../../../utils/formatters';

const paymentSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  invoiceId: z.number().min(1, 'Invoice is required'),
  paymentCode: z.string().optional(),
  paidAmount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER']),
  paidAt: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const PaymentFormModal: React.FC<PaymentFormModalProps> = ({
  isOpen, onClose, onSubmit, isSubmitting
}) => {
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: () => studentsApi.getAll() });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: 0,
      invoiceId: 0,
      paymentCode: '',
      paidAmount: 0,
      paymentMethod: 'BANK_TRANSFER',
      paidAt: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
      note: '',
    }
  });

  const selectedStudentId = watch('studentId');
  const selectedInvoiceId = watch('invoiceId');

  const { data: invoices } = useQuery({
    queryKey: ['invoices', 'student', selectedStudentId],
    queryFn: () => billingApi.getInvoicesByStudent(selectedStudentId),
    enabled: selectedStudentId > 0,
  });

  const unpaidInvoices = invoices?.filter(i => i.status === 'UNPAID' || i.status === 'PARTIAL') || [];

  // Auto-fill amount based on selected invoice
  useEffect(() => {
    if (selectedInvoiceId && unpaidInvoices.length > 0) {
      const inv = unpaidInvoices.find(i => i.id === selectedInvoiceId);
      if (inv) {
        setValue('paidAmount', inv.finalAmount - inv.paidAmount);
      }
    }
  }, [selectedInvoiceId, unpaidInvoices, setValue]);

  const handleFormSubmit = async (data: PaymentFormValues) => {
    // Backend expects paidAt in ISO, which input type datetime-local provides (needs to append :00.000Z if required, but usually native ISO is fine)
    const payload: PaymentCreateRequest = {
      invoiceId: data.invoiceId,
      paymentCode: data.paymentCode,
      paidAmount: data.paidAmount,
      paymentMethod: data.paymentMethod,
      paidAt: new Date(data.paidAt).toISOString(),
      note: data.note,
    };
    await onSubmit(payload);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        studentId: 0,
        invoiceId: 0,
        paymentCode: '',
        paidAmount: 0,
        paymentMethod: 'BANK_TRANSFER',
        paidAt: new Date().toISOString().slice(0, 16),
        note: '',
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" maxWidth="max-w-2xl">
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

          <FormField label="Unpaid Invoice" required error={errors.invoiceId}>
            <select
              {...register('invoiceId', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={!selectedStudentId || unpaidInvoices.length === 0}
            >
              <option value={0} disabled>Select an invoice...</option>
              {unpaidInvoices.map(i => (
                <option key={i.id} value={i.id}>
                  {i.invoiceCode} - Due: {formatCurrencyVND(i.finalAmount - i.paidAmount)}
                </option>
              ))}
            </select>
            {selectedStudentId > 0 && unpaidInvoices.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No unpaid invoices for this student.</p>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Payment Method" required error={errors.paymentMethod}>
            <select
              {...register('paymentMethod')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
            </select>
          </FormField>

          <FormField label="Amount Paid (VND)" required error={errors.paidAmount}>
            <input
              type="number"
              {...register('paidAmount', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Payment Code / Ref No." error={errors.paymentCode}>
            <input
              type="text"
              {...register('paymentCode')}
              placeholder="e.g. TXN-123456"
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all uppercase"
            />
          </FormField>

          <FormField label="Paid At" required error={errors.paidAt}>
            <input
              type="datetime-local"
              {...register('paidAt')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <FormField label="Note" error={errors.note}>
          <textarea
            {...register('note')}
            rows={2}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Payment details..."
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
            {isSubmitting ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
