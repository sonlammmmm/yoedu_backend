import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { coursesApi } from './courses.api';
import type { CourseResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrencyVND } from '../../utils/formatters';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { CourseFormModal } from './components/CourseFormModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { ConfirmDeleteModal } from '../students/components/ConfirmDeleteModal';

export const CoursesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

  const { data: courses, isLoading, isError, error } = useQuery({
    queryKey: ['courses', debouncedSearch],
    queryFn: () => coursesApi.getAll(debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create course')
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: Parameters<typeof coursesApi.update>[1] }) => coursesApi.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update course')
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete course')
  });

  const handleFormSubmit = async (payload: import('../../types/yoedu').CourseUpsertRequest) => {
    if (selectedCourse) {
      await updateMutation.mutateAsync({ id: selectedCourse.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = [
    { key: 'courseCode', header: 'Code' },
    { key: 'name', header: 'Course Name', render: (c: CourseResponse) => <span className="font-semibold">{c.name}</span> },
    { key: 'totalSessions', header: 'Sessions' },
    { key: 'fee', header: 'Fee', render: (c: CourseResponse) => formatCurrencyVND(c.fee) },
    { key: 'isActive', header: 'Status', render: (c: CourseResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${c.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {c.isActive ? 'Active' : 'Inactive'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Courses" 
        description="Manage educational programs" 
        onAdd={() => { setSelectedCourse(null); setIsFormOpen(true); }}
        addLabel="Add Course"
      />

      <DataTable
        data={courses}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={(c) => { setSelectedCourse(c); setIsDetailOpen(true); }}
        onEdit={(c) => { setSelectedCourse(c); setIsFormOpen(true); }}
        onDelete={(c) => { setSelectedCourse(c); setIsDeleteOpen(true); }}
        keyExtractor={(c) => c.id}
      />

      <CourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={selectedCourse}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <CourseDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        course={selectedCourse}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutateAsync(selectedCourse!.id)}
        title="Delete Course"
        message={`Are you sure you want to delete course ${selectedCourse?.name}?`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
