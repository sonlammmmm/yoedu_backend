import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { TeacherResponse, TeacherUpsertRequest } from '../../../types/yoedu';

const teacherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['TEACHER', 'ASSISTANT', 'BOTH']),
  isActive: z.boolean(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherResponse | null;
  onSubmit: (data: TeacherUpsertRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen, onClose, teacher, onSubmit, isSubmitting
}) => {
  const isEditing = !!teacher;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      role: 'TEACHER',
      isActive: true,
    }
  });

  useEffect(() => {
    if (teacher) {
      reset({
        fullName: teacher.fullName,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher.role,
        isActive: teacher.isActive,
      });
    } else {
      reset({
        fullName: '',
        phone: '',
        email: '',
        role: 'TEACHER',
        isActive: true,
      });
    }
  }, [teacher, reset, isOpen]);

  const onFormSubmit = async (data: TeacherFormValues) => {
    await onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Teacher' : 'Add New Teacher'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            {...register('fullName')}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Phone Number" required error={errors.phone}>
            <input
              type="text"
              {...register('phone')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="Email" required error={errors.email}>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Role" required error={errors.role}>
            <select
              {...register('role')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="TEACHER">Main Teacher</option>
              <option value="ASSISTANT">Assistant</option>
              <option value="BOTH">Both</option>
            </select>
          </FormField>

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
