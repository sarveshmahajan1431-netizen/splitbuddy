import React, { useState, useEffect, useRef } from 'react';
import type { User, Message } from '../types';
import * as chatService from '../services/chatService';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from './icons/Icons';

interface ChatLauncherProps {
  currentUser: User;
  users: User[];
  unreadCount: number;
  onConversationSelect: (partner: User) => void;
}

type Conversation = {
  partner: User;
  lastMessage: Message;
  unreadCount: number;
};

const ChatLauncher: React.FC<ChatLauncherProps> = ({ currentUser, users, unreadCount, onConversationSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const convos = chatService.getConversations(currentUser.id);
      // FIX: The object created in map must match the `Conversation` type.
      // The previous implementation using `{ ...convo, partner }` included `partnerId`,
      // which is not in the `Conversation` type, causing the type predicate to fail.
      const enrichedConvos = convos.map(convo => {
        const partner = users.find(u => u.id === convo.partnerId);
        return partner ? { partner, lastMessage: convo.lastMessage, unreadCount: convo.unreadCount } : null;
      }).filter((c): c is Conversation => c !== null);
      setConversations(enrichedConvos);
    }
  }, [isOpen, currentUser.id, users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (partner: User) => {
    setIsOpen(false);
    onConversationSelect(partner);
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    
    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  return (
    <div ref={launcherRef} className="fixed bottom-5 right-5 z-50">
      {/* Launcher Panel */}
      <div className={`
        absolute bottom-[calc(100%+1rem)] right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Your Conversations</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon /></button>
        </div>
        <div className="h-96 overflow-y-auto">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map(({ partner, lastMessage, unreadCount }) => (
                <li key={partner.id}>
                  <button onClick={() => handleSelect(partner)} className="w-full text-left p-3 hover:bg-gray-100 transition-colors flex items-center gap-3 border-b">
                    <div className="relative">
                        <img src={partner.imageUrl} alt={partner.name} className="w-12 h-12 rounded-full object-cover" />
                        {unreadCount > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-indigo-600 ring-2 ring-white"></span>}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between items-baseline">
                            <p className={`font-semibold truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{partner.name}</p>
                            <p className="text-xs text-gray-400 flex-shrink-0">{formatTimestamp(lastMessage.timestamp)}</p>
                        </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-600' : 'text-gray-500'}`}>{lastMessage.text}</p>
                        {unreadCount > 0 && <span className="flex-shrink-0 ml-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-gray-500">No conversations yet.</p>
              <p className="text-xs text-gray-400 mt-1">Start a chat from a user's profile!</p>
            </div>
          )}
        </div>
      </div>

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="bg-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label={isOpen ? "Close chats" : `Open chats, ${unreadCount} unread messages`}
      >
        {isOpen ? (
            <XMarkIcon className="w-8 h-8 mr-0" />
        ) : (
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 mr-0" />
        )}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatLauncher;