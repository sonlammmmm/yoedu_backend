import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { CourseResponse, CourseUpsertRequest } from '../../../types/yoedu';

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  totalSessions: z.number().min(1, 'Total sessions must be at least 1'),
  fee: z.number().min(0, 'Fee cannot be negative'),
  isActive: z.boolean(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseResponse | null;
  onSubmit: (data: CourseUpsertRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen, onClose, course, onSubmit, isSubmitting
}) => {
  const isEditing = !!course;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      description: '',
      totalSessions: 1,
      fee: 0,
      isActive: true,
    }
  });

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description || '',
        totalSessions: course.totalSessions,
        fee: course.fee,
        isActive: course.isActive,
      });
    } else {
      reset({
        name: '',
        description: '',
        totalSessions: 1,
        fee: 0,
        isActive: true,
      });
    }
  }, [course, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Course' : 'Add New Course'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Course Name" required error={errors.name}>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Total Sessions" required error={errors.totalSessions}>
            <input
              type="number"
              {...register('totalSessions', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Fee (VND)" required error={errors.fee}>
            <input
              type="number"
              {...register('fee', { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <FormField label="Status" required>
          <div className="pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">Is Active</span>
            </label>
          </div>
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
