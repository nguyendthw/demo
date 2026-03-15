import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { ReplacementRequest, Registration } from '../types';
import { ArrowRightLeft, Clock, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export default function ReplacementPage() {
  const { profile } = useAuth();
  const { replacements, setReplacements, registrations, allUsers } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [selectedReg, setSelectedReg] = useState('');
  const [proposedUser, setProposedUser] = useState('');
  const [reason, setReason] = useState('');

  const myRequests = replacements.filter(r => r.originalUserId === profile?.uid);
  const myRegistrations = registrations.filter(r => r.userId === profile?.uid && r.status === 'registered');
  const otherUsers = allUsers.filter(u => u.uid !== profile?.uid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedReg || !proposedUser) return;

    const reg = myRegistrations.find(r => r.id === selectedReg);
    const user = allUsers.find(u => u.uid === proposedUser);

    if (!reg || !user) return;

    const newReq: ReplacementRequest = {
      id: `repl-${Date.now()}`,
      registrationId: reg.id,
      sessionId: reg.sessionId,
      originalUserId: profile.uid,
      originalUserName: profile.displayName,
      proposedUserId: user.uid,
      proposedUserName: user.displayName,
      status: 'pending',
      reason
    };

    setReplacements(prev => [...prev, newReq]);
    setIsModalOpen(false);
    setSelectedReg('');
    setProposedUser('');
    setReason('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Yêu cầu thay thế</h1>
          <p className="text-slate-500 mt-1">Gửi yêu cầu nếu bạn không thể tham gia buổi PR đã đăng ký.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <UserPlus size={20} />
          <span>Tạo yêu cầu mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myRequests.length === 0 ? (
          <div className="md:col-span-2 py-12 bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <ArrowRightLeft size={48} className="mb-4 opacity-20" />
            <p>Bạn chưa có yêu cầu thay thế nào.</p>
          </div>
        ) : (
          myRequests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                  req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {req.status === 'pending' ? 'Đang chờ' : req.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={14} />
                  Vừa xong
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Bạn</p>
                  <p className="font-bold text-slate-900">{req.originalUserName}</p>
                </div>
                <ArrowRightLeft className="text-slate-300" />
                <div className="flex-1 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase">Người thay</p>
                  <p className="font-bold text-indigo-600">{req.proposedUserName}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 italic">" {req.reason} "</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tạo yêu cầu thay thế</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Chọn buổi PR muốn thay thế</label>
                <select 
                  required 
                  value={selectedReg}
                  onChange={(e) => setSelectedReg(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chọn buổi PR --</option>
                  {myRegistrations.map(reg => (
                    <option key={reg.id} value={reg.id}>Buổi PR ID: {reg.sessionId.substring(0, 8)}...</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Chọn thành viên thay thế</label>
                <select 
                  required 
                  value={proposedUser}
                  onChange={(e) => setProposedUser(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Chọn thành viên --</option>
                  {allUsers.map(u => (
                    <option key={u.uid} value={u.uid}>{u.displayName} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Lý do vắng mặt</label>
                <textarea 
                  required 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="Nhập lý do của bạn..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200">Gửi yêu cầu</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
