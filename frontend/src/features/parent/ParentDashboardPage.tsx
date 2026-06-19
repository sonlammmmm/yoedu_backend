import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { parentApi } from './parent.api';
import { PageHeader } from '../../components/ui/PageHeader';
import { formatCurrencyVND, formatDateVi } from '../../utils/formatters';
import { FileText, Calendar, GraduationCap } from 'lucide-react';
import type { InvoiceStatus } from '../../types/yoedu';

const statusColors: Record<InvoiceStatus, string> = {
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20',
  PARTIAL: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20',
  OVERPAID: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
};

export const ParentDashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['parentDashboard'],
    queryFn: parentApi.getDashboard,
  });

  if (isLoading) {
    return <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (isError || !data) {
    return <div className="py-12 text-center text-destructive">Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Parent Portal" 
        description="Monitor your children's progress, schedules, and invoices" 
      />

      {/* Children Section */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="text-primary" /> Children
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.children && data.children.length > 0 ? data.children.map(student => (
            <div key={student.id} className="bg-card border border-border rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-foreground">{student.fullName}</h4>
                  <p className="text-sm text-muted-foreground">Code: {student.studentCode}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'ACTIVE' ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {student.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-foreground/80">
                <p><strong>DOB:</strong> {formatDateVi(student.dob)}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Address:</strong> {student.address || 'N/A'}</p>
              </div>
            </div>
          )) : (
            <p className="text-muted-foreground italic col-span-full">No linked children found.</p>
          )}
        </div>
      </section>

      {/* Upcoming Classes & Schedule */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="text-orange-500" /> Upcoming Classes
        </h3>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {data.upcomingClasses && data.upcomingClasses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Class Name</th>
                    <th className="px-6 py-4 font-medium">Course</th>
                    <th className="px-6 py-4 font-medium">Room</th>
                    <th className="px-6 py-4 font-medium">Start Date</th>
                    <th className="px-6 py-4 font-medium">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.upcomingClasses.map(cls => (
                    <tr key={cls.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold">{cls.name}</td>
                      <td className="px-6 py-4">{cls.courseName}</td>
                      <td className="px-6 py-4">{cls.roomName || 'N/A'}</td>
                      <td className="px-6 py-4">{formatDateVi(cls.startDate)}</td>
                      <td className="px-6 py-4">{formatDateVi(cls.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground italic">No upcoming classes.</div>
          )}
        </div>
      </section>

      {/* Invoices */}
      <section>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" /> Recent Invoices
        </h3>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {data.recentInvoices && data.recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Invoice Code</th>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Paid</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary">{inv.invoiceCode}</td>
                      <td className="px-6 py-4">{inv.studentName}</td>
                      <td className="px-6 py-4 font-bold">{formatCurrencyVND(inv.finalAmount)}</td>
                      <td className="px-6 py-4 text-green-600">{formatCurrencyVND(inv.paidAmount)}</td>
                      <td className="px-6 py-4">{formatDateVi(inv.dueDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground italic">No recent invoices.</div>
          )}
        </div>
      </section>

    </div>
  );
};
