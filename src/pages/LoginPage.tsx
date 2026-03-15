import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, User, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      login(email, role);
      navigate('/');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
            <Users size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PR Scheduling Manager</h1>
          <p className="text-slate-500 text-center mt-2">Hệ thống quản lý hoạt động PR câu lạc bộ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Vai trò</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  role === 'member' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <User size={18} />
                <span>Thành viên</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <Shield size={18} />
                <span>BQT</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email sinh viên</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="sv@university.edu.vn"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Hoặc truy cập nhanh</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                login('admin@prclub.com', 'admin');
                navigate('/');
                setLoading(false);
              }, 300);
            }}
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            <span>Đăng nhập nhanh quyền BQT</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
