import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { PRSession, Registration } from '../types';
import { 
  Users, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  UserPlus,
  UserMinus,
  ArrowRightLeft,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'motion/react';
import { getMemberSuggestions, getClassSuggestions } from '../services/aiService';

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const { sessions, registrations, setRegistrations } = useApp();
  
  const session = sessions.find(s => s.id === id);
  const sessionRegistrations = registrations.filter(r => r.sessionId === id);
  const isRegistered = sessionRegistrations.some(r => r.userId === profile?.uid && r.status === 'registered');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [classSuggestions, setClassSuggestions] = useState<any>(null);

  const handleRegister = () => {
    if (!profile || !id) return;
    
    if (isRegistered) {
      setRegistrations(prev => prev.filter(r => !(r.sessionId === id && r.userId === profile.uid)));
    } else {
      const newReg: Registration = {
        id: `reg-${Date.now()}`,
        sessionId: id,
        userId: profile.uid,
        userName: profile.displayName,
        status: 'registered',
        timestamp: new Date().toISOString()
      };
      setRegistrations(prev => [...prev, newReg]);
    }
  };

  const getAISuggestions = async () => {
    if (!session) return;
    setAiLoading(true);
    const members = registrations.map(r => r.userName);
    const suggestions = await getMemberSuggestions(`Buổi PR ngày ${session.date} lúc ${session.timeSlot}`, members);
    setAiSuggestions(suggestions);
    setAiLoading(false);
  };

  const getAIClassSuggestions = async () => {
    if (!session) return;
    setAiLoading(true);
    const suggestions = await getClassSuggestions(session.classes);
    setClassSuggestions(suggestions);
    setAiLoading(false);
  };

  if (!session) return <div className="p-8 text-center">Đang tải...</div>;

  const memberCount = registrations.filter(r => r.status === 'registered').length;
  const isUnderstaffed = memberCount < 10;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/sessions')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ChevronLeft size={20} />
        <span>Quay lại lịch trình</span>
      </button>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                {session.timeSlot}
              </span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              <span className="text-sm font-medium text-indigo-100">
                {format(new Date(session.date), 'EEEE, dd MMMM yyyy', { locale: vi })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">PR Lớp: {session.classes.join(', ')}</h1>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-100 uppercase font-bold">Người phụ trách (BQT)</p>
                  <p className="font-semibold">{session.adminName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-100 uppercase font-bold">Thành viên đăng ký</p>
                  <p className="font-semibold">{memberCount}/10 người</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                Danh sách thành viên ({memberCount})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {registrations.filter(r => r.status === 'registered').map((reg) => (
                  <div key={reg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {reg.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{reg.userName}</span>
                    {reg.userId === profile?.uid && (
                      <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">BẠN</span>
                    )}
                  </div>
                ))}
                {memberCount === 0 && (
                  <p className="text-slate-400 text-sm italic col-span-2">Chưa có thành viên nào đăng ký.</p>
                )}
              </div>
            </section>

            {isUnderstaffed && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-amber-900">Thiếu nhân sự!</p>
                  <p className="text-xs text-amber-700 mt-0.5">Buổi PR này cần ít nhất 10 thành viên để diễn ra hiệu quả. Hãy kêu gọi thêm bạn bè nhé!</p>
                </div>
              </div>
            )}

            {/* AI Recommendations Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  Đề xuất thông minh (AI)
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={getAISuggestions}
                    disabled={aiLoading}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? 'Đang phân tích...' : 'Gợi ý thành viên'}
                  </button>
                  <button 
                    onClick={getAIClassSuggestions}
                    disabled={aiLoading}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? 'Đang phân tích...' : 'Gợi ý lớp thay thế'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {aiSuggestions && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <Users size={16} /> Thành viên tiềm năng
                    </h3>
                    <div className="space-y-3">
                      {aiSuggestions.suggestions?.map((s: any, i: number) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                          <p className="text-sm font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {classSuggestions && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                      <MapPin size={16} /> Lớp học thay thế
                    </h3>
                    <div className="space-y-3">
                      {classSuggestions.suggestions?.map((s: any, i: number) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                          <p className="text-sm font-bold text-slate-900">{s.className}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleRegister}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                    isRegistered 
                      ? "bg-white text-red-600 border border-red-100 shadow-red-100 hover:bg-red-50" 
                      : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                  )}
                >
                  {isRegistered ? <UserMinus size={20} /> : <UserPlus size={20} />}
                  {isRegistered ? 'Hủy đăng ký' : 'Đăng ký tham gia'}
                </button>
                
                <button className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <ArrowRightLeft size={20} />
                  Yêu cầu thay thế
                </button>

                <button className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <MapPin size={20} />
                  Đề xuất lớp khác
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Quy định</h3>
              <ul className="text-xs text-indigo-700 space-y-2 list-disc pl-4">
                <li>Mỗi buổi PR thành công cộng 1 điểm.</li>
                <li>Thành viên phải tham gia ít nhất 2 buổi/tháng.</li>
                <li>Hủy đăng ký trước 24h để tránh bị trừ điểm.</li>
                <li>Đảm bảo trang phục CLB khi đi PR.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
  return <CheckCircle2 size={size} className={className} />;
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
