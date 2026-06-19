import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import type { CourseClassResponse } from '../../../types/yoedu';
import { formatCurrencyVND, formatDateVi } from '../../../utils/formatters';

interface CourseClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseClass: CourseClassResponse | null;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-green-500/20 text-green-700',
  ONGOING: 'bg-blue-500/20 text-blue-700',
  CLOSED: 'bg-gray-500/20 text-gray-700',
  FULL: 'bg-orange-500/20 text-orange-700',
};

export const CourseClassDetailModal: React.FC<CourseClassDetailModalProps> = ({ isOpen, onClose, courseClass }) => {
  if (!courseClass) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Class Details" maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">General Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Class Name</p>
              <p className="font-medium text-lg text-primary">{courseClass.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{courseClass.courseName || `Course ID: ${courseClass.courseId}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${statusColors[courseClass.status]}`}>
                {courseClass.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDateVi(courseClass.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDateVi(courseClass.endDate)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Max Students</p>
                <p className="font-medium">{courseClass.maxStudents}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tuition Fee</p>
                <p className="font-medium">{formatCurrencyVND(courseClass.tuitionFee)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Logistics & Staff</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">{courseClass.roomName || 'Not Assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="font-medium">{courseClass.scheduleSlotId ? `Slot ID: ${courseClass.scheduleSlotId}` : 'Not Assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Main Teacher</p>
              <p className="font-medium">{courseClass.mainTeacherId ? `Teacher ID: ${courseClass.mainTeacherId}` : 'Not Assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assistant Teacher</p>
              <p className="font-medium">{courseClass.assistantTeacherId ? `Teacher ID: ${courseClass.assistantTeacherId}` : 'Not Assigned'}</p>
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
