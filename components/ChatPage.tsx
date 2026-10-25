import React, { useState, useEffect, useRef } from 'react';
import type { User, Message } from '../types';
import * as chatService from '../services/chatService';

interface ChatPageProps {
    currentUser: User;
    chatPartner: User;
    onBack: () => void;
    onMessagesRead: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, chatPartner, onBack, onMessagesRead }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadedMessages = chatService.getMessages(currentUser.id, chatPartner.id);
        setMessages(loadedMessages);

        const wereMessagesRead = chatService.markConversationAsRead(currentUser.id, chatPartner.id);
        if (wereMessagesRead) {
            onMessagesRead();
        }
    }, [currentUser.id, chatPartner.id, onMessagesRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const sentMessage = chatService.sendMessage(currentUser.id, chatPartner.id, newMessage);
        setMessages(prevMessages => [...prevMessages, sentMessage]);
        setNewMessage('');
    };
    
    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-150px)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center p-4 border-b bg-white rounded-t-lg shadow">
                <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                </button>
                <img src={chatPartner.imageUrl} alt={chatPartner.name} className="w-10 h-10 rounded-full object-cover mr-3"/>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{chatPartner.name}</h2>
                    <p className="text-sm text-gray-500">Online</p>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isSentByMe = msg.fromId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex items-end gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                {!isSentByMe && <img src={chatPartner.imageUrl} alt={chatPartner.name} className="w-6 h-6 rounded-full object-cover"/>}
                                <div>
                                    <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md ${isSentByMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-1 px-1 ${isSentByMe ? 'text-right' : 'text-left'}`}>
                                        {formatTimestamp(msg.timestamp)}
                                    </p>
                                </div>
                                {isSentByMe && <img src={currentUser.imageUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover"/>}
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t rounded-b-lg shadow">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-800"
                        aria-label="Chat message input"
                    />
                    <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition duration-300" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                    </button>
                </form>
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
        </div>
    );
};

export default ChatPage;