import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { teachersApi } from './teachers.api';
import type { TeacherResponse, TeacherUpsertRequest } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { TeacherFormModal } from './components/TeacherFormModal';
import { TeacherDetailModal } from './components/TeacherDetailModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal'; // Reusing ConfirmDeleteModal

export const TeachersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponse | null>(null);

  const { data: teachers, isLoading, isError, error } = useQuery({
    queryKey: ['teachers', debouncedSearch],
    queryFn: () => teachersApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create teacher')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: TeacherUpsertRequest }) => teachersApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update teacher')
  });

  const deleteMutation = useMutation({
    mutationFn: teachersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete teacher')
  });

  const handleFormSubmit = async (payload: TeacherUpsertRequest) => {
    if (selectedTeacher) {
      await updateMutation.mutateAsync({ id: selectedTeacher.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'teacherCode', header: 'Code' },
    { key: 'fullName', header: 'Name', render: (t: TeacherResponse) => <span className="font-semibold">{t.fullName}</span> },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (t: TeacherResponse) => <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs">{t.role}</span> },
    { key: 'isActive', header: 'Status', render: (t: TeacherResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${t.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {t.isActive ? 'Active' : 'Inactive'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Teachers" 
        description="Manage teaching staff" 
        onAdd={() => { setSelectedTeacher(null); setIsFormOpen(true); }}
        addLabel="Add Teacher"
      />

      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={(t) => { setSelectedTeacher(t); setIsDetailOpen(true); }}
        onEdit={(t) => { setSelectedTeacher(t); setIsFormOpen(true); }}
        onDelete={(t) => { setSelectedTeacher(t); setIsDeleteOpen(true); }}
        keyExtractor={(t) => t.id}
      />

      <TeacherFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        teacher={selectedTeacher}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <TeacherDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        teacher={selectedTeacher}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedTeacher!.id)}
        title="Delete Teacher"
        message={`Are you sure you want to delete teacher ${selectedTeacher?.fullName}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
