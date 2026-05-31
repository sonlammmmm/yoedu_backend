import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { scheduleSlotsApi } from './scheduleSlots.api';
import type { ScheduleSlotResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { ScheduleSlotFormModal } from './components/ScheduleSlotFormModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal';

const dayMap: Record<number, string> = {
  2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday', 8: 'Sunday'
};

export const ScheduleSlotsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlotResponse | null>(null);

  const { data: slots, isLoading, isError, error } = useQuery({
    queryKey: ['schedule-slots', debouncedSearch],
    queryFn: () => scheduleSlotsApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: scheduleSlotsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Schedule slot created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create schedule slot')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: Parameters<typeof scheduleSlotsApi.update>[1] }) => scheduleSlotsApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Schedule slot updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update schedule slot')
  });

  const deleteMutation = useMutation({
    mutationFn: scheduleSlotsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] });
      toast.success('Schedule slot deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete schedule slot')
  });

  const handleFormSubmit = async (payload: import('../../types/yoedu').ScheduleSlotUpsertRequest) => {
    if (selectedSlot) {
      await updateMutation.mutateAsync({ id: selectedSlot.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (s: ScheduleSlotResponse) => <span className="font-semibold">{s.name}</span> },
    { key: 'dayOfWeek', header: 'Day of Week', render: (s: ScheduleSlotResponse) => dayMap[s.dayOfWeek] || s.dayOfWeek },
    { key: 'startTime', header: 'Start Time' },
    { key: 'endTime', header: 'End Time' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Schedule Slots" 
        description="Manage timetable slots" 
        onAdd={() => { setSelectedSlot(null); setIsFormOpen(true); }}
        addLabel="Add Slot"
      />

      <DataTable
        data={slots}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={(s) => { setSelectedSlot(s); setIsFormOpen(true); }}
        onDelete={(s) => { setSelectedSlot(s); setIsDeleteOpen(true); }}
        keyExtractor={(s) => s.id}
      />

      <ScheduleSlotFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        slot={selectedSlot}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedSlot!.id)}
        title="Delete Schedule Slot"
        message={`Are you sure you want to delete slot ${selectedSlot?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
