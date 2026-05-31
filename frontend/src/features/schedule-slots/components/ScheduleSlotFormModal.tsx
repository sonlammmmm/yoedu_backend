import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { ScheduleSlotResponse, ScheduleSlotUpsertRequest } from '../../../types/yoedu';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const scheduleSlotSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startTime: z.string().regex(timeRegex, 'Must be HH:mm format'),
  endTime: z.string().regex(timeRegex, 'Must be HH:mm format'),
  dayOfWeek: z.number().min(2).max(8),
}).refine(data => {
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type ScheduleSlotFormValues = z.infer<typeof scheduleSlotSchema>;

interface ScheduleSlotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: ScheduleSlotResponse | null;
  onSubmit: (data: ScheduleSlotUpsertRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const ScheduleSlotFormModal: React.FC<ScheduleSlotFormModalProps> = ({
  isOpen, onClose, slot, onSubmit, isSubmitting
}) => {
  const isEditing = !!slot;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ScheduleSlotFormValues>({
    resolver: zodResolver(scheduleSlotSchema),
    defaultValues: {
      name: '',
      startTime: '08:00',
      endTime: '09:30',
      dayOfWeek: 2,
    }
  });

  useEffect(() => {
    if (slot) {
      reset({
        name: slot.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
        dayOfWeek: slot.dayOfWeek,
      });
    } else {
      reset({
        name: '',
        startTime: '08:00',
        endTime: '09:30',
        dayOfWeek: 2,
      });
    }
  }, [slot, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Schedule Slot' : 'Add New Schedule Slot'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Slot Name (e.g. Shift 1)" required error={errors.name}>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <FormField label="Day of Week" required error={errors.dayOfWeek}>
          <select
            {...register('dayOfWeek', { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value={2}>Monday</option>
            <option value={3}>Tuesday</option>
            <option value={4}>Wednesday</option>
            <option value={5}>Thursday</option>
            <option value={6}>Friday</option>
            <option value={7}>Saturday</option>
            <option value={8}>Sunday</option>
          </select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Start Time" required error={errors.startTime}>
            <input
              type="time"
              {...register('startTime')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormField>

          <FormField label="End Time" required error={errors.endTime}>
            <input
              type="time"
              {...register('endTime')}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
            />
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
