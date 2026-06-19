import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import type { StudentResponse, StudentUpsertRequest, StudentWithParentUpsertRequest } from '../../../types/yoedu';

const studentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DROPPED']),
  
  // Parent info fields (optional, used if withNewParent is true)
  withNewParent: z.boolean(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.withNewParent) {
    if (!data.parentName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Parent name is required', path: ['parentName'] });
    }
    if (!data.parentPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Parent phone is required', path: ['parentPhone'] });
    }
  }
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
  onSubmit: (data: StudentUpsertRequest | StudentWithParentUpsertRequest, isWithParent: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen, onClose, student, onSubmit, isSubmitting
}) => {
  const isEditing = !!student;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      dob: '',
      gender: 'MALE',
      address: '',
      status: 'ACTIVE',
      withNewParent: false,
    }
  });

  const withNewParent = useWatch({
    control,
    name: 'withNewParent',
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        dob: student.dob,
        gender: student.gender,
        address: student.address || '',
        parentId: student.parentId ? String(student.parentId) : undefined,
        status: student.status,
        withNewParent: false,
        parentName: '',
        parentPhone: '',
        parentEmail: '',
      });
    } else {
      reset({
        fullName: '',
        dob: '',
        gender: 'MALE',
        address: '',
        status: 'ACTIVE',
        withNewParent: false,
      });
    }
  }, [student, reset, isOpen]);

  const onFormSubmit = async (data: StudentFormValues) => {
    const baseStudent: StudentUpsertRequest = {
      fullName: data.fullName,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      parentId: (!data.withNewParent && data.parentId) ? Number(data.parentId) : undefined,
      status: data.status,
    };

    if (data.withNewParent) {
      const payload: StudentWithParentUpsertRequest = {
        student: baseStudent,
        parentName: data.parentName!,
        parentPhone: data.parentPhone!,
        parentEmail: data.parentEmail,
      };
      await onSubmit(payload, true);
    } else {
      await onSubmit(baseStudent, false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Student' : 'Add New Student'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date of Birth *</label>
            <input
              type="date"
              {...register('dob')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {errors.dob && <p className="text-destructive text-sm mt-1">{errors.dob.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Gender *</label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Address</label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status *</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </div>

          {!withNewParent && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Existing Parent ID</label>
              <input
                type="number"
                {...register('parentId')}
                placeholder="Optional"
                className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <label className="flex items-center space-x-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              {...register('withNewParent')}
              className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Create with new parent information</span>
          </label>

          {withNewParent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Parent Name *</label>
                <input
                  type="text"
                  {...register('parentName')}
                  className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {errors.parentName && <p className="text-destructive text-sm mt-1">{errors.parentName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent Phone *</label>
                <input
                  type="text"
                  {...register('parentPhone')}
                  className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {errors.parentPhone && <p className="text-destructive text-sm mt-1">{errors.parentPhone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent Email</label>
                <input
                  type="email"
                  {...register('parentEmail')}
                  className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
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
