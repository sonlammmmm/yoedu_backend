import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { paymentsApi } from './payments.api';
import type { PaymentResponse } from '../../types/yoedu';
import { formatCurrencyVND, formatDateTimeVi } from '../../utils/formatters';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { PaymentFormModal } from './components/PaymentFormModal';
import { useDebounce } from '../../hooks/useDebounce';

export const PaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: payments, isLoading, isError, error } = useQuery({
    queryKey: ['payments', debouncedSearch],
    queryFn: () => paymentsApi.getAll(), // Since no search param on getAll in our API right now, we fetch all. Local filtering could be added.
  });

  const filteredPayments = payments?.filter(p => 
    !debouncedSearch || 
    p.paymentCode?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.invoiceCode?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] }); // Important: invalidate invoices since payment changes their status
      toast.success('Payment recorded successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to record payment')
  });

  const handleFormSubmit = async (payload: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(payload);
  };

  const columns = [
    { key: 'paymentCode', header: 'Payment Code', render: (p: PaymentResponse) => <span className="font-semibold text-primary">{p.paymentCode || 'N/A'}</span> },
    { key: 'invoiceCode', header: 'Invoice', render: (p: PaymentResponse) => p.invoiceCode },
    { key: 'paidAmount', header: 'Amount', render: (p: PaymentResponse) => <span className="font-bold text-green-600">{formatCurrencyVND(p.paidAmount)}</span> },
    { key: 'paymentMethod', header: 'Method', render: (p: PaymentResponse) => (
      <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
        {p.paymentMethod.replace('_', ' ')}
      </span>
    )},
    { key: 'paidAt', header: 'Date', render: (p: PaymentResponse) => formatDateTimeVi(p.paidAt) },
    { key: 'cashierUsername', header: 'Cashier', render: (p: PaymentResponse) => p.cashierUsername || 'System' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payments" 
        description="Record and view incoming payments" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Record Payment"
      />

      <DataTable
        data={filteredPayments}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by Payment Code or Invoice Code..."
        keyExtractor={(p) => p.id}
      />

      <PaymentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
