import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { PRSession, Registration } from '../types';
import { 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const { sessions, registrations, allUsers } = useApp();
  
  const upcomingSessions = sessions
    .filter(s => s.status === 'active')
    .slice(0, 5);

  const myRegistrations = registrations.filter(r => r.userId === profile?.uid && r.status === 'registered');

  const stats = {
    totalSessions: sessions.length,
    totalMembers: allUsers.filter(u => u.role === 'member').length
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Xin chào, {profile?.displayName}! 👋</h1>
          <p className="text-slate-500 mt-1">Chào mừng bạn quay trở lại hệ thống quản lý PR.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
            <Clock size={18} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Điểm PR" 
          value={profile?.points || 0} 
          icon={Award} 
          color="bg-amber-500" 
          trend="+2 tuần này"
        />
        <StatCard 
          title="Buổi đã tham gia" 
          value={profile?.sessionsCount || 0} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          trend="Mục tiêu: 2"
        />
        {isAdmin ? (
          <>
            <StatCard 
              title="Tổng số buổi PR" 
              value={stats.totalSessions} 
              icon={Calendar} 
              color="bg-indigo-500" 
            />
            <StatCard 
              title="Tổng thành viên" 
              value={stats.totalMembers} 
              icon={Users} 
              color="bg-blue-500" 
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Đã đăng ký" 
              value={myRegistrations.length} 
              icon={Calendar} 
              color="bg-indigo-500" 
            />
            <StatCard 
              title="Xếp hạng" 
              value="#12" 
              icon={TrendingUp} 
              color="bg-blue-500" 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Buổi PR sắp tới</h2>
            <Link to="/sessions" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <div className="p-12 bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                <Calendar size={48} className="mb-4 opacity-20" />
                <p>Không có buổi PR nào sắp tới</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Thông báo & Hỗ trợ</h2>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-amber-900">Cần thêm thành viên</p>
                <p className="text-xs text-amber-700 mt-0.5">Buổi PR ngày 20/03 hiện chỉ có 6 thành viên đăng ký. Cần thêm 4 người nữa!</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lối tắt</h3>
              <Link to="/sessions" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <span className="font-medium text-slate-700">Đăng ký buổi PR mới</span>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <Link to="/replacements" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Users size={20} />
                  </div>
                  <span className="font-medium text-slate-700">Yêu cầu thay thế</span>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </motion.div>
  );
}

function SessionCard({ session }: { session: PRSession }) {
  return (
    <Link to={`/sessions/${session.id}`}>
      <motion.div 
        whileHover={{ x: 4 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-4"
      >
        <div className="w-14 h-14 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase">{format(new Date(session.date), 'MMM', { locale: vi })}</span>
          <span className="text-xl font-bold text-slate-900 leading-none">{format(new Date(session.date), 'dd')}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
              session.timeSlot === 'Sáng' ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
            )}>
              {session.timeSlot}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Người phụ trách: {session.adminName}</span>
          </div>
          <h3 className="font-bold text-slate-900 truncate">PR Lớp: {session.classes.join(', ')}</h3>
        </div>
        <div className="text-right">
          <ChevronRight size={20} className="text-slate-300" />
        </div>
      </motion.div>
    </Link>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
