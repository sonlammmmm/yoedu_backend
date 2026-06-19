import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  CreditCard, 
  LogOut,
  Settings,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const role = user?.role;
    
    const dashboardItem = { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' };
    const usersItem = { to: '/users', icon: <Users size={20} />, label: 'Users' };
    const teachersItem = { to: '/teachers', icon: <GraduationCap size={20} />, label: 'Teachers' };
    const coursesItem = { to: '/courses', icon: <BookOpen size={20} />, label: 'Courses' };
    const classesItem = { to: '/classes', icon: <BookOpen size={20} />, label: 'Classes' };
    const roomsItem = { to: '/rooms', icon: <Settings size={20} />, label: 'Rooms' };
    const studentsItem = { to: '/students', icon: <Users size={20} />, label: 'Students' };
    const enrollmentsItem = { to: '/enrollments', icon: <ClipboardCheck size={20} />, label: 'Enrollments' };
    const attendanceItem = { to: '/attendance', icon: <ClipboardCheck size={20} />, label: 'Attendance' };
    const scheduleSlotsItem = { to: '/schedule-slots', icon: <Calendar size={20} />, label: 'Schedules' };
    
    // Additional items based on prompt
    const learningResultsItem = { to: '/learning-results', icon: <FileText size={20} />, label: 'Learning Results' };
    const leaveRequestsItem = { to: '/leave-requests', icon: <Calendar size={20} />, label: 'Leave Requests' };
    const reportsItem = { to: '/reports', icon: <LayoutDashboard size={20} />, label: 'Reports' };
    
    const billingItem = { to: '/billing', icon: <CreditCard size={20} />, label: 'Billing' };
    const paymentsItem = { to: '/payments', icon: <CreditCard size={20} />, label: 'Payments' };
    const promotionsItem = { to: '/promotions', icon: <Settings size={20} />, label: 'Promotions' };

    if (role === 'ADMIN') {
      return [
        dashboardItem, usersItem, studentsItem, teachersItem, coursesItem, classesItem, roomsItem,
        enrollmentsItem, attendanceItem, scheduleSlotsItem, 
        learningResultsItem, leaveRequestsItem, reportsItem,
        billingItem, paymentsItem, promotionsItem
      ];
    } else if (role === 'ACADEMIC_STAFF') {
      return [
        dashboardItem,
        studentsItem, teachersItem, coursesItem, classesItem, enrollmentsItem,
        attendanceItem, learningResultsItem, leaveRequestsItem, reportsItem
      ];
    } else if (role === 'CASHIER') {
      return [
        dashboardItem,
        billingItem, paymentsItem, promotionsItem, reportsItem
      ];
    } else if (role === 'PARENT') {
      return [
        { to: '/parent', icon: <Users size={20} />, label: 'Parent Portal' },
      ];
    }
    
    return [dashboardItem];
  };

  const items = getNavItems();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col transition-all duration-300">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-2xl font-bold text-primary tracking-tight">YOEDU</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* Logout button was requested in Header, but can remain here too, or remove from here. I'll keep it here as well for convenience. */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
