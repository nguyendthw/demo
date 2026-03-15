export type UserRole = 'admin' | 'member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  points: number;
  sessionsCount: number;
  avatar?: string;
}

export interface PRSession {
  id: string;
  date: string;
  timeSlot: 'Sáng' | 'Chiều';
  classes: string[];
  adminId: string;
  adminName: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Registration {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  status: 'registered' | 'cancelled' | 'replaced';
  timestamp: string;
}

export interface ReplacementRequest {
  id: string;
  registrationId: string;
  sessionId: string;
  originalUserId: string;
  originalUserName: string;
  proposedUserId: string;
  proposedUserName: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface ClassSuggestion {
  id: string;
  sessionId: string;
  userId: string;
  originalClass: string;
  suggestedClass: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: any;
}
