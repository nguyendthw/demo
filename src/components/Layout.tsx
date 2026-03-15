import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  UserCircle, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const { profile, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Bảng điều khiển', path: '/', icon: LayoutDashboard },
    { name: 'Lịch PR', path: '/sessions', icon: Calendar },
    { name: 'Trò chuyện', path: '/chat', icon: MessageSquare },
    { name: 'Yêu cầu thay thế', path: '/replacements', icon: Users },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Quản trị BQT', path: '/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Users size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">PR Manager</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 font-medium" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{profile?.displayName}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.role === 'admin' ? 'Ban Quản Trị' : 'Thành viên'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Users size={18} />
          </div>
          <span className="font-bold text-lg">PR Manager</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Users size={24} />
          </div>
          <span className="font-bold text-xl">PR Manager</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-500"
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 rounded-xl">
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
