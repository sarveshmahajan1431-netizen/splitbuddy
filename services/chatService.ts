import type { Message } from '../types';

const CHATS_KEY = 'splitbuddy_chats';
type AllChats = Record<string, Message[]>;

const getConversationId = (user1Id: number, user2Id: number): string => {
  return [user1Id, user2Id].sort((a, b) => a - b).join('_');
};

const getAllChatsLocal = (): AllChats => {
  try {
    const chats = localStorage.getItem(CHATS_KEY);
    return chats ? JSON.parse(chats) : {};
  } catch (error) {
    return {};
  }
};

const saveAllChatsLocal = (chats: AllChats) => {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (error) {}
};

export const fetchMessagesAsync = async (user1Id: number, user2Id: number): Promise<Message[]> => {
  try {
    const res = await fetch(`/api/messages?user1Id=${user1Id}&user2Id=${user2Id}`);
    if (res.ok) {
      const messages: Message[] = await res.json();
      const allChats = getAllChatsLocal();
      const convId = getConversationId(user1Id, user2Id);
      allChats[convId] = messages;
      saveAllChatsLocal(allChats);
      return messages;
    }
  } catch (e) {}
  return getMessages(user1Id, user2Id);
};

export const getMessages = (user1Id: number, user2Id: number): Message[] => {
  const allChats = getAllChatsLocal();
  const conversationId = getConversationId(user1Id, user2Id);
  return allChats[conversationId] || [];
};

export const sendMessage = (fromId: number, toId: number, text: string): Message => {
  const allChats = getAllChatsLocal();
  const conversationId = getConversationId(fromId, toId);

  const tempMessage: Message = {
    id: Date.now(),
    fromId,
    toId,
    text,
    timestamp: Date.now(),
    readBy: [fromId],
  };

  const currentMessages = allChats[conversationId] || [];
  allChats[conversationId] = [...currentMessages, tempMessage];
  saveAllChatsLocal(allChats);

  fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId, toId, text })
  })
    .then(res => res.json())
    .then((savedMsg: Message) => {
      if (savedMsg && savedMsg.id) {
        const chats = getAllChatsLocal();
        const msgs = chats[conversationId] || [];
        chats[conversationId] = msgs.map(m => m.id === tempMessage.id ? savedMsg : m);
        saveAllChatsLocal(chats);
      }
    })
    .catch(err => console.error('Failed to save message to DB:', err));

  return tempMessage;
};

export const markConversationAsRead = (userId: number, partnerId: number): boolean => {
  const allChats = getAllChatsLocal();
  const conversationId = getConversationId(userId, partnerId);
  const messages = allChats[conversationId];
  let changed = false;

  if (messages) {
    messages.forEach(msg => {
      if (msg.toId === userId && !msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
        changed = true;
      }
    });

    if (changed) {
      allChats[conversationId] = messages;
      saveAllChatsLocal(allChats);
    }
  }

  fetch('/api/messages/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, partnerId })
  }).catch(err => console.error('Failed to sync message read status:', err));

  return changed;
};

export const getConversations = (userId: number): { partnerId: number, lastMessage: Message, unreadCount: number }[] => {
  const allChats = getAllChatsLocal();
  const userConversations: { partnerId: number, lastMessage: Message, unreadCount: number }[] = [];

  for (const conversationId in allChats) {
    if (conversationId.split('_').map(Number).includes(userId)) {
      const messages = allChats[conversationId];
      if (messages.length > 0) {
        const partnerId = conversationId.split('_').map(Number).find(id => id !== userId)!;
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(msg => msg.toId === userId && !msg.readBy.includes(userId)).length;

        userConversations.push({
          partnerId,
          lastMessage,
          unreadCount,
        });
      }
    }
  }

  return userConversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
};

export const getTotalUnreadCount = (userId: number): number => {
  const conversations = getConversations(userId);
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
};