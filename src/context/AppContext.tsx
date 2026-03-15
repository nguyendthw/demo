import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PRSession, Registration, ReplacementRequest, ChatMessage, ClassSuggestion } from '../types';
import { MOCK_USERS, MOCK_SESSIONS, MOCK_REGISTRATIONS } from '../store/mockData';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  sessions: PRSession[];
  setSessions: React.Dispatch<React.SetStateAction<PRSession[]>>;
  registrations: Registration[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
  replacements: ReplacementRequest[];
  setReplacements: React.Dispatch<React.SetStateAction<ReplacementRequest[]>>;
  messages: Record<string, ChatMessage[]>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  suggestions: ClassSuggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<ClassSuggestion[]>>;
  allUsers: UserProfile[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pr_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [sessions, setSessions] = useState<PRSession[]>(() => {
    const saved = localStorage.getItem('pr_sessions');
    return saved ? JSON.parse(saved) : MOCK_SESSIONS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('pr_registrations');
    return saved ? JSON.parse(saved) : MOCK_REGISTRATIONS;
  });

  const [replacements, setReplacements] = useState<ReplacementRequest[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [],
    admin: []
  });
  const [suggestions, setSuggestions] = useState<ClassSuggestion[]>([]);

  useEffect(() => {
    localStorage.setItem('pr_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pr_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pr_registrations', JSON.stringify(registrations));
  }, [registrations]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      sessions, setSessions,
      registrations, setRegistrations,
      replacements, setReplacements,
      messages, setMessages,
      suggestions, setSuggestions,
      allUsers: MOCK_USERS
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
