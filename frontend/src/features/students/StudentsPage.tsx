import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Eye, User } from 'lucide-react';
import toast from 'react-hot-toast';

import { studentsApi } from './students.api';
import type { StudentResponse } from '../../types/yoedu';
import { useDebounce } from '../../hooks/useDebounce';

import { StudentFormModal } from './components/StudentFormModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { format } from 'date-fns';

export const StudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  // Fetch Queries
  const { data: students, isLoading, isError, error } = useQuery({
    queryKey: ['students', debouncedSearch],
    queryFn: () => studentsApi.getAll(debouncedSearch),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: { id?: number; payload: unknown; isWithParent: boolean }) => data.isWithParent 
      ? studentsApi.createWithParent(data.payload as import('../../types/yoedu').StudentWithParentUpsertRequest) 
      : studentsApi.create(data.payload as import('../../types/yoedu').StudentUpsertRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create student');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id?: number; payload: unknown; isWithParent: boolean }) => data.isWithParent 
      ? studentsApi.updateWithParent(data.id as number, data.payload as import('../../types/yoedu').StudentWithParentUpsertRequest) 
      : studentsApi.update(data.id as number, data.payload as import('../../types/yoedu').StudentUpsertRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update student');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
      setIsDeleteOpen(false);
      setSelectedStudent(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete student');
    }
  });

  // Handlers
  const handleOpenCreate = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (payload: unknown, isWithParent: boolean) => {
    if (selectedStudent) {
      await updateMutation.mutateAsync({ id: selectedStudent.id, payload, isWithParent });
    } else {
      await createMutation.mutateAsync({ payload, isWithParent });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudent) {
      await deleteMutation.mutateAsync(selectedStudent.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground">Manage all students in the system</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-125">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name, code, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full min-h-75 text-destructive">
              <p>Failed to load students. {(error as Error)?.message}</p>
            </div>
          ) : students?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-75 text-muted-foreground">
              <User size={48} className="mb-4 opacity-50" />
              <p>No students found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Full Name</th>
                  <th className="px-6 py-4 font-medium">DOB</th>
                  <th className="px-6 py-4 font-medium">Gender</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students?.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{student.studentCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-semibold">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4">{format(new Date(student.dob), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'ACTIVE' ? 'bg-primary/20 text-primary-foreground' : 
                        student.status === 'PAUSED' ? 'bg-orange-500/20 text-orange-600' : 'bg-destructive/20 text-destructive-foreground'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenDetail(student)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(student)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        student={selectedStudent}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={selectedStudent}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete student ${selectedStudent?.fullName}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
