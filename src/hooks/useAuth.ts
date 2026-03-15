import { useApp } from '../context/AppContext';

export function useAuth() {
  const { user, setUser } = useApp();

  const login = (email: string, role: 'admin' | 'member') => {
    const newUser = {
      uid: role === 'admin' ? 'admin-1' : 'member-1',
      email,
      displayName: role === 'admin' ? 'Admin Demo' : 'Thành viên Demo',
      role,
      points: role === 'admin' ? 999 : 0,
      sessionsCount: role === 'admin' ? 50 : 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return { 
    user, 
    profile: user, 
    loading: false, 
    isAdmin: user?.role === 'admin',
    login,
    logout
  };
}
