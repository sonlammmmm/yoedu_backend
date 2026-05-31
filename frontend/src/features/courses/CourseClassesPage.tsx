import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { courseClassesApi } from './courseClasses.api';
import type { CourseClassResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { CourseClassFormModal } from './components/CourseClassFormModal';
import { CourseClassDetailModal } from './components/CourseClassDetailModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal';
import { formatDateVi } from '../../utils/formatters';

const statusColors: Record<string, string> = {
  OPEN: 'bg-green-500/20 text-green-700',
  ONGOING: 'bg-blue-500/20 text-blue-700',
  CLOSED: 'bg-gray-500/20 text-gray-700',
  FULL: 'bg-orange-500/20 text-orange-700',
};

export const CourseClassesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CourseClassResponse | null>(null);

  const { data: classes, isLoading, isError, error } = useQuery({
    queryKey: ['course-classes', debouncedSearch],
    queryFn: () => courseClassesApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: courseClassesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-classes'] });
      toast.success('Class created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create class')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: Parameters<typeof courseClassesApi.update>[1] }) => courseClassesApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-classes'] });
      toast.success('Class updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update class')
  });

  const deleteMutation = useMutation({
    mutationFn: courseClassesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-classes'] });
      toast.success('Class deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete class')
  });

  const handleFormSubmit = async (payload: import('../../types/yoedu').CourseClassCreateRequest) => {
    if (selectedClass) {
      await updateMutation.mutateAsync({ id: selectedClass.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'name', header: 'Class Name', render: (c: CourseClassResponse) => <span className="font-semibold text-primary">{c.name}</span> },
    { key: 'courseName', header: 'Course', render: (c: CourseClassResponse) => c.courseName || `Course #${c.courseId}` },
    { key: 'duration', header: 'Duration', render: (c: CourseClassResponse) => <span className="text-sm">{formatDateVi(c.startDate)} - {formatDateVi(c.endDate)}</span> },
    { key: 'roomName', header: 'Room', render: (c: CourseClassResponse) => c.roomName || 'N/A' },
    { key: 'status', header: 'Status', render: (c: CourseClassResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
        {c.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Course Classes" 
        description="Manage active teaching classes" 
        onAdd={() => { setSelectedClass(null); setIsFormOpen(true); }}
        addLabel="Add Class"
      />

      <DataTable
        data={classes}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={(c) => { setSelectedClass(c); setIsDetailOpen(true); }}
        onEdit={(c) => { setSelectedClass(c); setIsFormOpen(true); }}
        onDelete={(c) => { setSelectedClass(c); setIsDeleteOpen(true); }}
        keyExtractor={(c) => c.id}
      />

      <CourseClassFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        courseClass={selectedClass}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <CourseClassDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        courseClass={selectedClass}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedClass!.id)}
        title="Delete Class"
        message={`Are you sure you want to delete class ${selectedClass?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
