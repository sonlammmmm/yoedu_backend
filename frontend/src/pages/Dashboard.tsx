import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, GraduationCap, Calendar, CreditCard, 
  LineChart as LineChartIcon, BarChart3, AlertTriangle 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

import { reportsApi } from '../features/reports/reports.api';
import { formatCurrencyVND } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth() + 1);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: reportsApi.getDashboardStats
  });

  const { data: monthlyRevenue, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthlyRevenue', selectedYear],
    queryFn: () => reportsApi.getMonthlyRevenue(selectedYear)
  });

  const { data: courseRevenue, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['courseRevenue', selectedYear, selectedMonth],
    queryFn: () => reportsApi.getCourseRevenue(selectedYear, selectedMonth)
  });

  // Prepare data for recharts
  const monthlyChartData = (monthlyRevenue || []).map(m => ({
    name: `Tháng ${m.month}`,
    revenue: m.revenue
  }));

  const courseChartData = (courseRevenue || []).map(c => ({
    name: c.courseName,
    revenue: c.revenue
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of the YOEDU system</p>
      </div>

      {isLoadingStats ? (
        <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.studentsCount || 0}</h3>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Courses</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.coursesCount || 0}</h3>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
            <div className="p-4 rounded-full bg-orange-500/10 text-orange-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classes</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.classesCount || 0}</h3>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
            <div className="p-4 rounded-full bg-purple-500/10 text-purple-500">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Month Revenue</p>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrencyVND(stats?.currentMonthRevenue || 0)}</h3>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
            <div className="p-4 rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unpaid Invoices</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.unpaidInvoicesCount || 0}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <LineChartIcon size={20} className="text-primary" /> 
              Monthly Revenue
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
            >
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-h-75">
            {isLoadingMonthly ? (
              <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : monthlyChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
                  />
                  <Tooltip 
                    formatter={(value: unknown) => [formatCurrencyVND(Number(value) || 0), "Revenue"]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Course Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" /> 
              Revenue by Course
            </h3>
            <div className="flex space-x-2">
              <select
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-1.5 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="">All Year</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 min-h-75">
            {isLoadingCourse ? (
              <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : courseChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
                  />
                  <Tooltip 
                    formatter={(value: unknown) => [formatCurrencyVND(Number(value) || 0), "Revenue"]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
