import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import type { StudentResponse } from '../../../types/yoedu';
import { format } from 'date-fns';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Student Code</p>
              <p className="font-medium">{student.studentCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{student.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{format(new Date(student.dob), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{student.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{student.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                student.status === 'ACTIVE' ? 'bg-primary/20 text-primary-foreground' : 
                student.status === 'PAUSED' ? 'bg-orange-500/20 text-orange-600' : 'bg-destructive/20 text-destructive-foreground'
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Parent Information</h3>
          <div className="space-y-4">
            {student.parentId ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Parent ID</p>
                  <p className="font-medium">{student.parentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p className="font-medium">{student.parentName || 'N/A'}</p>
                </div>
                {/* Normally we might have phone and email here if the backend returns it in a joined DTO, but we display what we have */}
              </>
            ) : (
              <p className="text-muted-foreground italic">No parent information linked.</p>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2 mt-8">System Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{format(new Date(student.createdAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{format(new Date(student.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
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
