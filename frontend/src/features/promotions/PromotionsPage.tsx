import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { promotionsApi } from './promotions.api';
import type { PromotionResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrencyVND, formatDateVi } from '../../utils/formatters';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { PromotionFormModal } from './components/PromotionFormModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal';

export const PromotionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionResponse | null>(null);

  const { data: promotions, isLoading, isError, error } = useQuery({
    queryKey: ['promotions', debouncedSearch],
    queryFn: () => promotionsApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: promotionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create promotion')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: Parameters<typeof promotionsApi.update>[1] }) => promotionsApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update promotion')
  });

  const deleteMutation = useMutation({
    mutationFn: promotionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete promotion')
  });

  const handleFormSubmit = async (payload: import('../../types/yoedu').PromotionUpsertRequest) => {
    // Format dates to ISO if needed by backend, though YYYY-MM-DD might be fine.
    // Assuming backend accepts 'YYYY-MM-DD' since it's LocalDate typically or parses it.
    if (selectedPromotion) {
      await updateMutation.mutateAsync({ id: selectedPromotion.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'code', header: 'Code', render: (p: PromotionResponse) => <span className="font-bold text-primary">{p.code}</span> },
    { key: 'description', header: 'Description' },
    { key: 'discountValue', header: 'Value', render: (p: PromotionResponse) => (
      p.discountType === 'PERCENTAGE' || p.discountType === 'PERCENT' 
        ? `${p.discountValue}%` 
        : formatCurrencyVND(p.discountValue)
    )},
    { key: 'validity', header: 'Validity', render: (p: PromotionResponse) => (
      <span className="text-sm">
        {formatDateVi(p.startDate)} - {formatDateVi(p.endDate)}
      </span>
    )},
    { key: 'isActive', header: 'Status', render: (p: PromotionResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {p.isActive ? 'Active' : 'Inactive'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Promotions" 
        description="Manage billing discounts and promotions" 
        onAdd={() => { setSelectedPromotion(null); setIsFormOpen(true); }}
        addLabel="Add Promotion"
      />

      <DataTable
        data={promotions}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={(p) => { setSelectedPromotion(p); setIsFormOpen(true); }}
        onDelete={(p) => { setSelectedPromotion(p); setIsDeleteOpen(true); }}
        keyExtractor={(p) => p.id}
      />

      <PromotionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        promotion={selectedPromotion}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedPromotion!.id)}
        title="Delete Promotion"
        message={`Are you sure you want to delete promotion ${selectedPromotion?.code}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
