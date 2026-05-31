import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { billingApi } from './billing.api';
import { studentsApi } from '../students/students.api';
import type { InvoiceResponse, InvoiceStatus } from '../../types/yoedu';
import { formatCurrencyVND, formatDateVi } from '../../utils/formatters';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { InvoiceFormModal } from './components/InvoiceFormModal';

const statusColors: Record<InvoiceStatus, string> = {
  UNPAID: 'bg-red-500/20 text-red-700',
  PARTIAL: 'bg-yellow-500/20 text-yellow-700',
  PAID: 'bg-green-500/20 text-green-700',
  OVERPAID: 'bg-blue-500/20 text-blue-700',
};

export const BillingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Queries
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: () => studentsApi.getAll() });

  const { data: invoices, isLoading, isError, error } = useQuery({
    queryKey: ['invoices', 'student', selectedStudentId],
    queryFn: () => billingApi.getInvoicesByStudentId(selectedStudentId as number),
    enabled: selectedStudentId !== '',
  });

  const createMutation = useMutation({
    mutationFn: billingApi.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create invoice')
  });

  const handleFormSubmit = async (payload: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(payload);
  };

  const columns = [
    { key: 'invoiceCode', header: 'Invoice Code', render: (i: InvoiceResponse) => <span className="font-semibold text-primary">{i.invoiceCode}</span> },
    { key: 'amount', header: 'Amount', render: (i: InvoiceResponse) => formatCurrencyVND(i.amount) },
    { key: 'discountAmount', header: 'Discount', render: (i: InvoiceResponse) => formatCurrencyVND(i.discountAmount) },
    { key: 'finalAmount', header: 'Final Amount', render: (i: InvoiceResponse) => <span className="font-bold">{formatCurrencyVND(i.finalAmount)}</span> },
    { key: 'paidAmount', header: 'Paid', render: (i: InvoiceResponse) => formatCurrencyVND(i.paidAmount) },
    { key: 'dueDate', header: 'Due Date', render: (i: InvoiceResponse) => formatDateVi(i.dueDate) },
    { key: 'status', header: 'Status', render: (i: InvoiceResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[i.status]}`}>
        {i.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Billing & Invoices" 
        description="Manage student tuition and billing" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Create Invoice"
      />

      <div className="bg-card border border-border rounded-2xl shadow-sm p-4">
        <div className="max-w-md mb-6">
          <label className="block text-sm font-medium text-foreground mb-1">Select Student to View Invoices</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
          >
            <option value="">-- Choose a student --</option>
            {students?.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
            ))}
          </select>
        </div>

        {selectedStudentId !== '' ? (
          <DataTable
            data={invoices}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            error={error}
            keyExtractor={(i) => i.id}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground border-t border-border mt-4">
            <p>Please select a student to view their invoices.</p>
          </div>
        )}
      </div>

      <InvoiceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
