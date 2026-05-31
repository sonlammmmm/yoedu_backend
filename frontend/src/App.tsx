import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, RoleGuard } from './routes/ProtectedRoute';

// Layouts & Pages
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { StudentsPage } from './features/students/StudentsPage';
import { TeachersPage } from './features/teachers/TeachersPage';
import { CoursesPage } from './features/courses/CoursesPage';
import { CourseClassesPage } from './features/courses/CourseClassesPage';
import { EnrollmentsPage } from './features/enrollments/EnrollmentsPage';
import { AttendancePage } from './features/attendance/AttendancePage';
import { RoomsPage } from './features/rooms/RoomsPage';
import { ScheduleSlotsPage } from './features/schedule-slots/ScheduleSlotsPage';
import { PromotionsPage } from './features/promotions/PromotionsPage';
import { BillingPage } from './features/billing/BillingPage';
import { PaymentsPage } from './features/billing/PaymentsPage';
import { ParentDashboardPage } from './features/parent/ParentDashboardPage';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* General/Dashboard - Admin, Staff, Cashier */}
                <Route path="/dashboard" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF', 'CASHIER']}><Dashboard /></RoleGuard>} />
                
                {/* Users (Admin Only) */}
                <Route path="/users" element={<RoleGuard allowedRoles={['ADMIN']}><PlaceholderPage title="Users Management" /></RoleGuard>} />
                
                {/* Academic & Management (Admin, Academic Staff) */}
                <Route path="/students" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><StudentsPage /></RoleGuard>} />
                <Route path="/teachers" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><TeachersPage /></RoleGuard>} />
                <Route path="/courses" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><CoursesPage /></RoleGuard>} />
                <Route path="/classes" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><CourseClassesPage /></RoleGuard>} />
                <Route path="/rooms" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><RoomsPage /></RoleGuard>} />
                <Route path="/enrollments" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><EnrollmentsPage /></RoleGuard>} />
                <Route path="/attendance" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><AttendancePage /></RoleGuard>} />
                <Route path="/schedule-slots" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><ScheduleSlotsPage /></RoleGuard>} />
                <Route path="/learning-results" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><PlaceholderPage title="Learning Results" /></RoleGuard>} />
                <Route path="/leave-requests" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}><PlaceholderPage title="Leave Requests" /></RoleGuard>} />
                
                {/* Reports (Admin, Academic Staff, Cashier) */}
                <Route path="/reports" element={<RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF', 'CASHIER']}><PlaceholderPage title="Reports" /></RoleGuard>} />

                {/* Billing & Finance (Admin, Cashier) */}
                <Route path="/billing" element={<RoleGuard allowedRoles={['ADMIN', 'CASHIER']}><BillingPage /></RoleGuard>} />
                <Route path="/payments" element={<RoleGuard allowedRoles={['ADMIN', 'CASHIER']}><PaymentsPage /></RoleGuard>} />
                <Route path="/promotions" element={<RoleGuard allowedRoles={['ADMIN', 'CASHIER']}><PromotionsPage /></RoleGuard>} />

                {/* Parent Routes */}
                <Route path="/parent" element={<RoleGuard allowedRoles={['PARENT']}><ParentDashboardPage /></RoleGuard>} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
