import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import type { RoomResponse, RoomUpsertRequest } from '../../../types/yoedu';

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  isActive: z.boolean(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomResponse | null;
  onSubmit: (data: RoomUpsertRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen, onClose, room, onSubmit, isSubmitting
}) => {
  const isEditing = !!room;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      capacity: 20,
      isActive: true,
    }
  });

  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        capacity: room.capacity,
        isActive: room.isActive,
      });
    } else {
      reset({
        name: '',
        capacity: 20,
        isActive: true,
      });
    }
  }, [room, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Room' : 'Add New Room'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Room Name" required error={errors.name}>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </FormField>

        <FormField label="Capacity" required error={errors.capacity}>
          <input
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all"
          />
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
