import { UserProfile, PRSession, Registration, ReplacementRequest, ChatMessage, ClassSuggestion } from '../types';

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'admin-1',
    email: 'admin@prclub.com',
    displayName: 'Admin Demo',
    role: 'admin',
    points: 999,
    sessionsCount: 50,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    uid: 'member-1',
    email: 'member@prclub.com',
    displayName: 'Thành viên 1',
    role: 'member',
    points: 10,
    sessionsCount: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Member1'
  }
];

export const MOCK_SESSIONS: PRSession[] = [
  {
    id: 'session-1',
    date: '2026-03-20',
    timeSlot: 'Sáng',
    classes: ['CNTT1', 'Kế toán 2'],
    adminId: 'admin-1',
    adminName: 'Admin Demo',
    status: 'active'
  },
  {
    id: 'session-2',
    date: '2026-03-21',
    timeSlot: 'Chiều',
    classes: ['Marketing 3', 'Kinh tế 1'],
    adminId: 'admin-1',
    adminName: 'Admin Demo',
    status: 'active'
  }
];

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    sessionId: 'session-1',
    userId: 'member-1',
    userName: 'Thành viên 1',
    status: 'registered',
    timestamp: new Date().toISOString()
  }
];
