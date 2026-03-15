import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import ChatPage from './pages/ChatPage';
import AdminManagementPage from './pages/AdminManagementPage';
import ReplacementPage from './pages/ReplacementPage';
import { AppProvider } from './context/AppContext';

function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }>
            <Route index element={<Dashboard />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="sessions/:id" element={<SessionDetailPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="replacements" element={<ReplacementPage />} />
            <Route path="admin" element={
              <AuthGuard adminOnly>
                <AdminManagementPage />
              </AuthGuard>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
