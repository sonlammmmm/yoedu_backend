// Enums defined as string literal unions
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED';
export type TeacherRole = 'TEACHER' | 'ASSISTANT' | 'BOTH';
export type ClassStatus = 'OPEN' | 'ONGOING' | 'CLOSED' | 'FULL';
export type EnrollmentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED' | 'COMPLETED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';
export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'PERCENT' | 'AMOUNT';
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERPAID';
export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ================= STUDENTS & PARENTS =================

export interface StudentResponse {
  id: number;
  studentCode: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address?: string;
  parentId?: number;
  parentName?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentUpsertRequest {
  fullName: string;
  dob: string;
  gender: Gender;
  address?: string;
  parentId?: number;
  status: StudentStatus;
}

export interface StudentWithParentUpsertRequest {
  student: StudentUpsertRequest;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
}

// ================= TEACHERS =================

export interface TeacherResponse {
  id: number;
  teacherCode: string;
  fullName: string;
  phone: string;
  email: string;
  role: TeacherRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherUpsertRequest {
  fullName: string;
  phone: string;
  email: string;
  role: TeacherRole;
  isActive: boolean;
}

// ================= COURSES & CLASSES =================

export interface CourseResponse {
  id: number;
  courseCode: string;
  name: string;
  description?: string;
  totalSessions: number;
  fee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseUpsertRequest {
  name: string;
  description?: string;
  totalSessions: number;
  fee: number;
  isActive: boolean;
}

export interface CourseClassResponse {
  id: number;
  classCode: string;
  name: string;
  courseId: number;
  courseName?: string;
  roomId?: number;
  roomName?: string;
  scheduleSlotId?: number;
  mainTeacherId?: number;
  assistantTeacherId?: number;
  startDate: string;
  endDate: string;
  maxStudents: number;
  tuitionFee: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseClassCreateRequest {
  name: string;
  courseId: number;
  roomId?: number;
  scheduleSlotId?: number;
  mainTeacherId?: number;
  assistantTeacherId?: number;
  startDate: string;
  endDate: string;
  maxStudents: number;
  tuitionFee: number;
  status: ClassStatus;
}

// ================= ENROLLMENTS =================

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName?: string;
  courseClassId: number;
  className?: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentCreateRequest {
  studentId: number;
  courseClassId: number;
  enrolledAt: string;
  status: EnrollmentStatus;
  note?: string;
}

// ================= ATTENDANCE =================

export interface AttendanceResponse {
  id: number;
  studentId: number;
  studentName?: string;
  courseClassId: number;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceCreateRequest {
  studentId: number;
  courseClassId: number;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendanceRowDto {
  studentId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceBatchRequest {
  courseClassId: number;
  date: string;
  attendances: StudentAttendanceRowDto[];
}

// ================= BILLING & PAYMENTS =================

export interface InvoiceResponse {
  id: number;
  invoiceCode: string;
  studentId: number;
  studentName?: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCreateRequest {
  studentId: number;
  amount: number;
  discountAmount?: number;
  dueDate: string;
  note?: string;
  classId?: number;
  billingMonth?: string;
}

export interface PaymentResponse {
  id: number;
  invoiceId: number;
  invoiceCode?: string;
  paymentCode: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  cashierUserId?: number;
  cashierUsername?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCreateRequest {
  invoiceId: number;
  paymentCode?: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  note?: string;
}

export interface PromotionResponse {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionUpsertRequest {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ================= ROOMS & SCHEDULES =================

export interface RoomResponse {
  id: number;
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface RoomUpsertRequest {
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface ScheduleSlotResponse {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 2=Monday, 8=Sunday
}

export interface ScheduleSlotUpsertRequest {
  name: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}

// ================= ACADEMIC RESULTS =================

export interface LearningResultResponse {
  id: number;
  studentId: number;
  courseClassId: number;
  score: number;
  evaluation: string;
  teacherId: number;
  recordedDate: string;
}

export interface LearningResultCreateRequest {
  studentId: number;
  courseClassId: number;
  score: number;
  evaluation: string;
  recordedDate: string;
}

export interface LeaveRequestResponse {
  id: number;
  studentId: number;
  courseClassId: number;
  requestDate: string;
  leaveDate: string;
  reason: string;
  status: LeaveRequestStatus;
}

export interface LeaveRequestCreateRequest {
  studentId: number;
  courseClassId: number;
  leaveDate: string;
  reason: string;
}

// ================= DASHBOARD & PORTALS =================

export interface MonthlyRevenueDto {
  month: number;
  year: number;
  revenue: number;
}

export interface CourseRevenueDto {
  courseId: number;
  courseName: string;
  revenue: number;
}

export interface DashboardStatsResponse {
  studentsCount: number;
  coursesCount: number;
  classesCount: number;
  currentMonthRevenue: number;
  unpaidInvoicesCount: number;
}

export interface ParentDashboardResponse {
  children: StudentResponse[];
  recentInvoices: InvoiceResponse[];
  upcomingClasses: CourseClassResponse[];
}
