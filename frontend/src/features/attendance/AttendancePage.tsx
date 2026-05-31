import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { PageHeader } from '../../components/ui/PageHeader';
import { courseClassesApi } from '../courses/courseClasses.api';
import { enrollmentsApi } from '../enrollments/enrollments.api';
import { attendanceApi } from './attendance.api';
import type { AttendanceBatchRequest, AttendanceStatus, StudentAttendanceRowDto } from '../../types/yoedu';
import { formatDateVi } from '../../utils/formatters';
import { CheckCircle, AlertCircle, Clock, Info } from 'lucide-react';

interface MatrixRow {
  studentId: number;
  studentName: string;
  attendances?: Record<string, string>;
  note?: string;
}

const statusConfig: Record<AttendanceStatus, { color: string; icon: React.ReactNode; label: string }> = {
  PRESENT: { color: 'bg-green-500/20 text-green-700 border-green-500/30', icon: <CheckCircle size={16} />, label: 'Present' },
  ABSENT: { color: 'bg-red-500/20 text-red-700 border-red-500/30', icon: <AlertCircle size={16} />, label: 'Absent' },
  LATE: { color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30', icon: <Clock size={16} />, label: 'Late' },
  EXCUSED: { color: 'bg-blue-500/20 text-blue-700 border-blue-500/30', icon: <Info size={16} />, label: 'Excused' },
};

export const AttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'TAKE' | 'MATRIX'>('TAKE');
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  
  // Date defaults to today in YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Local state for attendance form
  const [attendanceForm, setAttendanceForm] = useState<Record<number, StudentAttendanceRowDto>>({});

  // Queries
  const { data: classes } = useQuery({ 
    queryKey: ['course-classes'], 
    queryFn: () => courseClassesApi.getAll() 
  });

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => enrollmentsApi.getByClassId(selectedClassId as number),
    enabled: selectedClassId !== '',
  });

  const { data: existingAttendances, isLoading: isLoadingAttendances } = useQuery({
    queryKey: ['attendances', selectedClassId, selectedDate],
    queryFn: () => attendanceApi.getByClassId(selectedClassId as number, selectedDate),
    enabled: selectedClassId !== '' && selectedDate !== '' && activeTab === 'TAKE',
  });

  const { data: matrixData, isLoading: isLoadingMatrix } = useQuery({
    queryKey: ['attendances-matrix', selectedClassId],
    queryFn: () => attendanceApi.getMatrixByClassId(selectedClassId as number) as Promise<MatrixRow[]>,
    enabled: activeTab === 'MATRIX' && selectedClassId !== '',
  });

  // Initialize form state when enrollments or existing attendances change
  useEffect(() => {
    if (enrollments && activeTab === 'TAKE') {
      const newForm: Record<number, StudentAttendanceRowDto> = {};
      
      enrollments.forEach((enrollment: import('../../types/yoedu').EnrollmentResponse) => {
        // Find existing record if any
        const existing = existingAttendances?.find(a => a.studentId === enrollment.studentId);
        
        newForm[enrollment.studentId] = {
          studentId: enrollment.studentId,
          status: existing ? existing.status : 'PRESENT', // default to PRESENT
          note: existing?.note || '',
        };
      });
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttendanceForm(newForm);
    }
  }, [enrollments, existingAttendances, activeTab]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceForm(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setAttendanceForm(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note }
    }));
  };

  const submitBatchMutation = useMutation({
    mutationFn: (data: AttendanceBatchRequest) => attendanceApi.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['attendances-matrix'] });
      toast.success('Attendance recorded successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to submit attendance')
  });

  const handleSubmit = () => {
    if (!selectedClassId || !selectedDate) return;

    const payload: AttendanceBatchRequest = {
      courseClassId: Number(selectedClassId),
      date: selectedDate,
      attendances: Object.values(attendanceForm),
    };

    submitBatchMutation.mutate(payload);
  };

  // Matrix processing
  const getMatrixColumns = () => {
    if (!matrixData || matrixData.length === 0) return [];
    // Collect all unique dates from all students
    const dates = new Set<string>();
    matrixData.forEach((row: MatrixRow) => {
      if (row.attendances) {
        Object.keys(row.attendances).forEach(d => dates.add(d));
      }
    });
    return Array.from(dates).sort(); // Sort chronologically
  };

  const matrixColumns = getMatrixColumns();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance Tracking" 
        description="Record and view student attendance" 
      />

      <div className="bg-card border border-border rounded-2xl shadow-sm p-4">
        {/* Settings Bar */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 border-b border-border pb-6">
          <div className="flex-1 max-w-sm">
            <label className="block text-sm font-medium text-foreground mb-1">Select Class <span className="text-destructive">*</span></label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
            >
              <option value="">-- Choose a class --</option>
              {classes?.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.courseName})</option>
              ))}
            </select>
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-border pb-2">
          <button 
            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'TAKE' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('TAKE')}
          >
            Take Attendance
          </button>
          <button 
            className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'MATRIX' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('MATRIX')}
          >
            Attendance Matrix
          </button>
        </div>

        {/* Content */}
        {!selectedClassId ? (
          <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p>Please select a class to view or record attendance.</p>
          </div>
        ) : (
          <>
            {/* Take Attendance Tab */}
            {activeTab === 'TAKE' && (
              <div>
                {(isLoadingEnrollments || isLoadingAttendances) ? (
                  <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                ) : !enrollments || enrollments.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No students are enrolled in this class.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-6 py-4 font-medium w-1/4">Student</th>
                            <th className="px-6 py-4 font-medium w-1/2">Status</th>
                            <th className="px-6 py-4 font-medium w-1/4">Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {enrollments.map((student: import('../../types/yoedu').EnrollmentResponse) => {
                            const currentStatus = attendanceForm[student.studentId]?.status || 'PRESENT';
                            const currentNote = attendanceForm[student.studentId]?.note || '';
                            
                            return (
                              <tr key={student.studentId} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-semibold">{student.studentName}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-2">
                                    {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map(status => (
                                      <label 
                                        key={status}
                                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full cursor-pointer border transition-all ${
                                          currentStatus === status 
                                            ? statusConfig[status].color 
                                            : 'bg-transparent border-border text-muted-foreground hover:bg-muted'
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`status-${student.studentId}`}
                                          value={status}
                                          checked={currentStatus === status}
                                          onChange={() => handleStatusChange(student.studentId, status)}
                                          className="sr-only"
                                        />
                                        {statusConfig[status].icon}
                                        <span className="text-xs font-medium">{statusConfig[status].label}</span>
                                      </label>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    type="text"
                                    value={currentNote}
                                    onChange={(e) => handleNoteChange(student.studentId, e.target.value)}
                                    placeholder="Add a note..."
                                    className="w-full px-3 py-1.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleSubmit}
                        disabled={submitBatchMutation.isPending}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors font-medium shadow-sm disabled:opacity-50"
                      >
                        {submitBatchMutation.isPending ? 'Saving...' : 'Save Attendance'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Matrix Tab */}
            {activeTab === 'MATRIX' && (
              <div>
                {isLoadingMatrix ? (
                  <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                ) : !matrixData || matrixData.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No attendance data available for this class.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4 font-medium sticky left-0 z-20 bg-muted/95 backdrop-blur">Student</th>
                          {matrixColumns.map(date => (
                            <th key={date} className="px-4 py-4 font-medium text-center">{formatDateVi(date)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {matrixData.map((row: MatrixRow) => (
                          <tr key={row.studentId} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-semibold sticky left-0 z-10 bg-card">
                              {row.studentName}
                            </td>
                            {matrixColumns.map(date => {
                              const status = row.attendances?.[date] as AttendanceStatus | undefined;
                              return (
                                <td key={date} className="px-4 py-4 text-center">
                                  {status ? (
                                    <div className="flex justify-center">
                                      <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${statusConfig[status].color}`} title={`${status} - ${row.note || ''}`}>
                                        {statusConfig[status].icon}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground/30">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
