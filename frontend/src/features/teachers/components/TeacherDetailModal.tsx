import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import type { TeacherResponse } from '../../../types/yoedu';
import { formatDateTimeVi } from '../../../utils/formatters';

interface TeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherResponse | null;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({ isOpen, onClose, teacher }) => {
  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teacher Details" maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Teacher Code</p>
              <p className="font-medium">{teacher.teacherCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{teacher.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{teacher.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{teacher.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Status & Role</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <span className="inline-block px-2 py-1 text-xs rounded-full mt-1 bg-blue-500/20 text-blue-600">
                {teacher.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                teacher.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {teacher.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2 mt-8">System Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDateTimeVi(teacher.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDateTimeVi(teacher.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-border flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
