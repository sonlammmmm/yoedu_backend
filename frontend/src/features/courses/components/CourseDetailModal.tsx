import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import type { CourseResponse } from '../../../types/yoedu';
import { formatDateTimeVi, formatCurrencyVND } from '../../../utils/formatters';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseResponse | null;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ isOpen, onClose, course }) => {
  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Details" maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Code</p>
              <p className="font-medium">{course.courseCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{course.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium whitespace-pre-wrap">{course.description || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="font-medium">{course.totalSessions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fee</p>
              <p className="font-medium text-primary">{formatCurrencyVND(course.fee)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                course.isActive ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2 mt-8">System Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDateTimeVi(course.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDateTimeVi(course.updatedAt)}</p>
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
