import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { PRSession } from '../types';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function SessionsPage() {
  const { profile, isAdmin } = useAuth();
  const { sessions, setSessions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<'Sáng' | 'Chiều'>('Sáng');
  const [classes, setClasses] = useState('');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const newSession: PRSession = {
      id: `session-${Date.now()}`,
      date,
      timeSlot,
      classes: classes.split(',').map(c => c.trim()),
      adminId: profile?.uid || '',
      adminName: profile?.displayName || '',
      status: 'active'
    };

    setSessions(prev => [newSession, ...prev]);
    setIsModalOpen(false);
    setDate('');
    setClasses('');
  };

  const handleDeleteSession = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa buổi PR này?')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lịch trình PR</h1>
          <p className="text-slate-500 mt-1">Quản lý và đăng ký các buổi PR lớp học.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus size={20} />
            <span>Tạo buổi PR mới</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm lớp học, người phụ trách..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={20} />
          <span>Lọc</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} isAdmin={isAdmin} onDelete={handleDeleteSession} />
        ))}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tạo buổi PR mới</h2>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Ngày diễn ra</label>
                  <input 
                    type="date" 
                    required 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Buổi</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Sáng', 'Chiều'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot as any)}
                        className={`py-3 rounded-xl border font-medium transition-all ${
                          timeSlot === slot ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Danh sách lớp (cách nhau bởi dấu phẩy)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="CNTT1, Kế toán 2, ..."
                    value={classes}
                    onChange={(e) => setClasses(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all"
                  >
                    Tạo buổi PR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionCard({ session, isAdmin, onDelete }: { session: PRSession, isAdmin: boolean, onDelete: (id: string) => void }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600 border border-indigo-100">
              <span className="text-[10px] font-bold uppercase">{format(new Date(session.date), 'MMM', { locale: vi })}</span>
              <span className="text-lg font-bold leading-none">{format(new Date(session.date), 'dd')}</span>
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                session.timeSlot === 'Sáng' ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
              }`}>
                {session.timeSlot}
              </span>
              <p className="text-xs text-slate-500 mt-1">BQT: {session.adminName}</p>
            </div>
          </div>
          {isAdmin && (
            <button 
              onClick={(e) => { e.preventDefault(); onDelete(session.id); }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">PR Lớp: {session.classes.join(', ')}</h3>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>12/10 thành viên</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{format(new Date(session.date), 'EEEE', { locale: vi })}</span>
          </div>
        </div>

        <Link 
          to={`/sessions/${session.id}`}
          className="block w-full py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 font-semibold rounded-xl text-center transition-all"
        >
          Chi tiết & Đăng ký
        </Link>
      </div>
    </motion.div>
  );
}
