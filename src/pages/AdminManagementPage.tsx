import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { ReplacementRequest, ClassSuggestion } from '../types';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  ArrowRightLeft, 
  MapPin,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminManagementPage() {
  const { isAdmin } = useAuth();
  const { allUsers, replacements, setReplacements, suggestions, setSuggestions, setRegistrations } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'replacements' | 'suggestions'>('users');

  const handleApproveReplacement = (req: ReplacementRequest, approved: boolean) => {
    setReplacements(prev => prev.map(r => r.id === req.id ? { ...r, status: approved ? 'approved' : 'rejected' } : r));
    if (approved) {
      setRegistrations(prev => prev.map(reg => reg.id === req.registrationId ? { 
        ...reg, 
        userId: req.proposedUserId,
        userName: req.proposedUserName
      } : reg));
    }
  };

  const handleApproveSuggestion = (sug: ClassSuggestion, approved: boolean) => {
    setSuggestions(prev => prev.map(s => s.id === sug.id ? { ...s, status: approved ? 'approved' : 'rejected' } : s));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản trị Hệ thống</h1>
        <p className="text-slate-500 mt-1">Quản lý thành viên, yêu cầu thay thế và đề xuất lớp học.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Thành viên" />
        <TabButton active={activeTab === 'replacements'} onClick={() => setActiveTab('replacements')} icon={ArrowRightLeft} label="Thay thế" />
        <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')} icon={MapPin} label="Đề xuất lớp" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100">
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Thành viên</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Vai trò</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Điểm PR</th>
                      <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Số buổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map((user) => (
                      <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {user.displayName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{user.displayName}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {user.role === 'admin' ? 'BQT' : 'Member'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                            <Award size={16} />
                            <span>{user.points}</span>
                          </div>
                        </td>
                        <td className="py-4 font-medium text-slate-700">{user.sessionsCount} buổi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'replacements' && (
            <motion.div key="replacements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
              {replacements.length === 0 ? (
                <div className="py-12 text-center text-slate-400">Không có yêu cầu thay thế nào.</div>
              ) : (
                replacements.map((req) => (
                  <div key={req.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Người vắng</p>
                        <p className="font-bold text-slate-900">{req.originalUserName}</p>
                      </div>
                      <ArrowRightLeft className="text-slate-300" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Người thay</p>
                        <p className="font-bold text-indigo-600">{req.proposedUserName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {req.status === 'pending' ? (
                        <>
                          <button onClick={() => handleApproveReplacement(req, false)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <XCircle size={24} />
                          </button>
                          <button onClick={() => handleApproveReplacement(req, true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                            <CheckCircle2 size={24} />
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div key="suggestions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-4">
              {suggestions.length === 0 ? (
                <div className="py-12 text-center text-slate-400">Không có đề xuất lớp học nào.</div>
              ) : (
                suggestions.map((sug) => (
                  <div key={sug.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">
                          {sug.originalClass}
                        </div>
                        <ArrowRightLeft size={16} className="text-slate-300" />
                        <div className="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-bold text-white">
                          {sug.suggestedClass}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {sug.status === 'pending' ? (
                          <>
                            <button onClick={() => handleApproveSuggestion(sug, false)} className="text-xs font-bold text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg">Từ chối</button>
                            <button onClick={() => handleApproveSuggestion(sug, true)} className="text-xs font-bold text-emerald-600 px-3 py-1.5 hover:bg-emerald-50 rounded-lg">Duyệt</button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 uppercase">{sug.status}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic">" {sug.reason} "</p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
        active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
