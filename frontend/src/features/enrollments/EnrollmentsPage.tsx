import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { enrollmentsApi } from './enrollments.api';
import { courseClassesApi } from '../courses/courseClasses.api';
import { studentsApi } from '../students/students.api';
import type { EnrollmentResponse } from '../../types/yoedu';
import { formatDateTimeVi } from '../../utils/formatters';

import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { EnrollmentFormModal } from './components/EnrollmentFormModal';

export const EnrollmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'BY_CLASS' | 'BY_STUDENT'>('BY_CLASS');
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Queries for select dropdowns
  const { data: classes } = useQuery({ queryKey: ['course-classes'], queryFn: () => courseClassesApi.getAll() });
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: () => studentsApi.getAll() });

  // Queries for data tables
  const { data: enrollmentsByClass, isLoading: isLoadingClass } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => enrollmentsApi.getByClassId(selectedClassId as number),
    enabled: activeTab === 'BY_CLASS' && selectedClassId !== '',
  });

  const { data: enrollmentsByStudent, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['enrollments', 'student', selectedStudentId],
    queryFn: () => enrollmentsApi.getByStudentId(selectedStudentId as number),
    enabled: activeTab === 'BY_STUDENT' && selectedStudentId !== '',
  });

  const createMutation = useMutation({
    mutationFn: enrollmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Enrollment created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to enroll student')
  });

  const handleFormSubmit = async (payload: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(payload);
  };

  const classColumns = [
    { key: 'studentName', header: 'Student Name', render: (e: EnrollmentResponse) => <span className="font-semibold">{e.studentName}</span> },
    { key: 'enrolledAt', header: 'Enrolled At', render: (e: EnrollmentResponse) => formatDateTimeVi(e.enrolledAt) },
    { key: 'status', header: 'Status', render: (e: EnrollmentResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${e.status === 'ACTIVE' ? 'bg-green-500/20 text-green-700' : 'bg-muted text-muted-foreground'}`}>{e.status}</span>
    )},
    { key: 'note', header: 'Note', render: (e: EnrollmentResponse) => e.note || '-' },
  ];

  const studentColumns = [
    { key: 'class', header: 'Class', render: (t: EnrollmentResponse) => <span className="font-semibold text-primary">{t.className}</span> },
    { key: 'courseName', header: 'Course', render: (e: EnrollmentResponse) => e.className },
    { key: 'enrolledAt', header: 'Enrolled At', render: (e: EnrollmentResponse) => formatDateTimeVi(e.enrolledAt) },
    { key: 'status', header: 'Status', render: (e: EnrollmentResponse) => (
      <span className={`px-2 py-1 rounded-full text-xs ${e.status === 'ACTIVE' ? 'bg-green-500/20 text-green-700' : 'bg-muted text-muted-foreground'}`}>{e.status}</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Enrollments" 
        description="Manage student course registrations" 
        onAdd={() => setIsFormOpen(true)}
        addLabel="Enroll Student"
      />

      <div className="bg-card border border-border rounded-2xl shadow-sm p-4">
        <div className="flex space-x-4 mb-6 border-b border-border pb-2">
          <button 
            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'BY_CLASS' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('BY_CLASS')}
          >
            View By Class
          </button>
          <button 
            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'BY_STUDENT' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('BY_STUDENT')}
          >
            View By Student
          </button>
        </div>

        {activeTab === 'BY_CLASS' && (
          <div className="space-y-4">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-foreground mb-1">Select a Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- Choose a class --</option>
                {classes?.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                ))}
              </select>
            </div>

            {selectedClassId !== '' && (
              <DataTable
                data={enrollmentsByClass}
                columns={classColumns}
                isLoading={isLoadingClass}
                isError={false}
                keyExtractor={(e) => e.id}
              />
            )}
          </div>
        )}

        {activeTab === 'BY_STUDENT' && (
          <div className="space-y-4">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-foreground mb-1">Select a Student</label>
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

            {selectedStudentId !== '' && (
              <DataTable
                data={enrollmentsByStudent}
                columns={studentColumns}
                isLoading={isLoadingStudent}
                isError={false}
                keyExtractor={(e) => e.id}
              />
            )}
          </div>
        )}
      </div>

      <EnrollmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending}
        preselectedClassId={activeTab === 'BY_CLASS' && selectedClassId !== '' ? Number(selectedClassId) : undefined}
        preselectedStudentId={activeTab === 'BY_STUDENT' && selectedStudentId !== '' ? Number(selectedStudentId) : undefined}
      />
    </div>
  );
};
