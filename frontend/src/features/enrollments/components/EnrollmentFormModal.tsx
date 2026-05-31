import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { EnrollmentCreateRequest } from '../../../types/yoedu';

import { studentsApi } from '../../students/students.api';
import { courseClassesApi } from '../../courses/courseClasses.api';

const enrollmentSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  classId: z.number().min(1, 'Class is required'),
  note: z.string().optional(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EnrollmentCreateRequest) => Promise<void>;
  isSubmitting: boolean;
  preselectedClassId?: number;
  preselectedStudentId?: number;
}

export const EnrollmentFormModal: React.FC<EnrollmentFormModalProps> = ({
  isOpen, onClose, onSubmit, isSubmitting, preselectedClassId, preselectedStudentId
}) => {
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: () => studentsApi.getAll() });
  const { data: classes } = useQuery({ queryKey: ['course-classes'], queryFn: () => courseClassesApi.getAll() });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: preselectedStudentId || 0,
      classId: preselectedClassId || 0,
      note: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        studentId: preselectedStudentId || 0,
        classId: preselectedClassId || 0,
        note: '',
      });
    }
  }, [isOpen, preselectedClassId, preselectedStudentId, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll Student" maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Student" required error={errors.studentId}>
          <select
            {...register('studentId', { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={!!preselectedStudentId}
          >
            <option value={0} disabled>Select a student...</option>
            {students?.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
            ))}
          </select>
        </FormField>

        <FormField label="Class" required error={errors.classId}>
          <select
            {...register('classId', { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={!!preselectedClassId}
          >
            <option value={0} disabled>Select a class...</option>
            {classes?.filter(c => c.status === 'OPEN' || c.status === 'ONGOING').map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.courseName})</option>
            ))}
          </select>
        </FormField>

        <FormField label="Note" error={errors.note}>
          <textarea
            {...register('note')}
            rows={3}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Optional enrollment notes..."
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
