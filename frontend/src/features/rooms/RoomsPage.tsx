import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { roomsApi } from './rooms.api';
import type { RoomResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { RoomFormModal } from './components/RoomFormModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal';

export const RoomsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);

  const { data: rooms, isLoading, isError, error } = useQuery({
    queryKey: ['rooms', debouncedSearch],
    queryFn: () => roomsApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create room')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: Parameters<typeof roomsApi.update>[1] }) => roomsApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update room')
  });

  const deleteMutation = useMutation({
    mutationFn: roomsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete room')
  });

  const handleFormSubmit = async (payload: import('../../types/yoedu').RoomUpsertRequest) => {
    if (selectedRoom) {
      await updateMutation.mutateAsync({ id: selectedRoom.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Room Name', render: (r: RoomResponse) => <span className="font-semibold">{r.name}</span> },
    { key: 'capacity', header: 'Capacity' },
    { key: 'isActive', header: 'Status', render: (r: RoomResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${r.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rooms" 
        description="Manage physical classrooms" 
        onAdd={() => { setSelectedRoom(null); setIsFormOpen(true); }}
        addLabel="Add Room"
      />

      <DataTable
        data={rooms}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={(r) => { setSelectedRoom(r); setIsFormOpen(true); }}
        onDelete={(r) => { setSelectedRoom(r); setIsDeleteOpen(true); }}
        keyExtractor={(r) => r.id}
      />

      <RoomFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        room={selectedRoom}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedRoom!.id)}
        title="Delete Room"
        message={`Are you sure you want to delete room ${selectedRoom?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
