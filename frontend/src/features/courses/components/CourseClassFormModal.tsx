import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { CourseClassResponse, CourseClassCreateRequest } from '../../../types/yoedu';

import { referenceApi } from '../../reference/reference.api';
import { coursesApi } from '../courses.api';

const courseClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  courseId: z.number().min(1, 'Course is required'),
  roomId: z.number().optional(),
  scheduleSlotId: z.number().optional(),
  mainTeacherId: z.number().optional(),
  assistantTeacherId: z.number().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxStudents: z.number().min(1, 'Must be at least 1'),
  tuitionFee: z.number().min(0, 'Cannot be negative'),
  status: z.enum(['OPEN', 'ONGOING', 'CLOSED', 'FULL']),
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type CourseClassFormValues = z.infer<typeof courseClassSchema>;

interface CourseClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseClass: CourseClassResponse | null;
  onSubmit: (data: CourseClassCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const CourseClassFormModal: React.FC<CourseClassFormModalProps> = ({
  isOpen, onClose, courseClass, onSubmit, isSubmitting
}) => {
  const isEditing = !!courseClass;

  // Fetch reference data
  const { data: courses } = useQuery({ queryKey: ['courses'], queryFn: () => coursesApi.getAll() });
  const { data: teachers } = useQuery({ queryKey: ['reference', 'teachers'], queryFn: referenceApi.getTeachers });
  const { data: rooms } = useQuery({ queryKey: ['reference', 'rooms'], queryFn: referenceApi.getRooms });
  const { data: scheduleSlots } = useQuery({ queryKey: ['reference', 'schedule-slots'], queryFn: referenceApi.getScheduleSlots });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseClassFormValues>({
    resolver: zodResolver(courseClassSchema),
    defaultValues: {
      name: '',
      courseId: 0,
      startDate: '',
      endDate: '',
      maxStudents: 20,
      tuitionFee: 0,
      status: 'OPEN',
    }
  });

  useEffect(() => {
    if (courseClass) {
      reset({
        name: courseClass.name,
        courseId: courseClass.courseId,
        roomId: courseClass.roomId,
        scheduleSlotId: courseClass.scheduleSlotId,
        mainTeacherId: courseClass.mainTeacherId,
        assistantTeacherId: courseClass.assistantTeacherId,
        startDate: courseClass.startDate.split('T')[0],
        endDate: courseClass.endDate.split('T')[0],
        maxStudents: courseClass.maxStudents,
        tuitionFee: courseClass.tuitionFee,
        status: courseClass.status,
      });
    } else {
      reset({
        name: '',
        courseId: 0,
        startDate: '',
        endDate: '',
        maxStudents: 20,
        tuitionFee: 0,
        status: 'OPEN',
      });
    }
  }, [courseClass, reset, isOpen]);

  const handleFormSubmit = async (data: CourseClassFormValues) => {
    await onSubmit(data as CourseClassCreateRequest);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Class' : 'Add New Class'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Class Name" required error={errors.name}>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Course" required error={errors.courseId}>
            <select
              {...register('courseId', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value={0} disabled>Select a course...</option>
              {courses?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Room" error={errors.roomId}>
            <select
              {...register('roomId', { valueAsNumber: true, setValueAs: v => v ? Number(v) : undefined })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">None</option>
              {rooms?.map(r => (
                <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Schedule Slot" error={errors.scheduleSlotId}>
            <select
              {...register('scheduleSlotId', { valueAsNumber: true, setValueAs: v => v ? Number(v) : undefined })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">None</option>
              {scheduleSlots?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Main Teacher" error={errors.mainTeacherId}>
            <select
              {...register('mainTeacherId', { valueAsNumber: true, setValueAs: v => v ? Number(v) : undefined })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">None</option>
              {teachers?.filter(t => t.role !== 'ASSISTANT').map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Assistant Teacher" error={errors.assistantTeacherId}>
            <select
              {...register('assistantTeacherId', { valueAsNumber: true, setValueAs: v => v ? Number(v) : undefined })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">None</option>
              {teachers?.filter(t => t.role !== 'TEACHER').map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Start Date" required error={errors.startDate}>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="End Date" required error={errors.endDate}>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Max Students" required error={errors.maxStudents}>
            <input
              type="number"
              {...register('maxStudents', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Tuition Fee" required error={errors.tuitionFee}>
            <input
              type="number"
              {...register('tuitionFee', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Status" required error={errors.status}>
            <select
              {...register('status')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="OPEN">Open</option>
              <option value="ONGOING">Ongoing</option>
              <option value="CLOSED">Closed</option>
              <option value="FULL">Full</option>
            </select>
          </FormField>
        </div>

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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
