import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage } from '../types';
import { Send, Hash, Shield, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ChatPage() {
  const { profile, isAdmin } = useAuth();
  const { messages, setMessages } = useApp();
  const [activeChannel, setActiveChannel] = useState<'general' | 'admin'>('general');
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const channelMessages = messages[activeChannel] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: activeChannel,
      senderId: profile.uid,
      senderName: profile.displayName,
      senderRole: profile.role,
      text: newMessage,
      timestamp: { toDate: () => new Date() }
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), msg]
    }));
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveChannel('general')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${
            activeChannel === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Hash size={18} />
          <span>Kênh Chung</span>
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveChannel('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all ${
              activeChannel === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Shield size={18} />
            <span>Ban Quản Trị</span>
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
      >
        {channelMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Bắt đầu cuộc trò chuyện...</p>
          </div>
        ) : (
          channelMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.senderId === profile?.uid ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.senderName}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  msg.senderRole === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {msg.senderRole === 'admin' ? 'BQT' : 'Thành viên'}
                </span>
              </div>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                msg.senderId === profile?.uid 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] text-slate-400 mt-1 px-1">
                {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'HH:mm', { locale: vi }) : ''}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
