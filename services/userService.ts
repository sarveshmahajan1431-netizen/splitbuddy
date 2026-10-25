import type { User } from '../types';

const USERS_KEY = 'splitbuddy_users';
const USER_DATA_KEY = 'splitbuddy_user_data';

// Helper to get local cache
const getCachedUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const setCachedUsers = (users: User[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {}
};

export const fetchUsersAsync = async (): Promise<User[]> => {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const users: User[] = await res.json();
      setCachedUsers(users);
      return users;
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to cache:', err);
  }
  return getCachedUsers();
};

export const getUsers = (): User[] => {
  // Fire off async fetch in background to sync cache
  fetchUsersAsync().catch(() => {});
  return getCachedUsers();
};

export const saveUsers = (users: User[]) => {
  setCachedUsers(users);
};

export const updateUser = (updatedUser: User): User[] => {
  const users = getCachedUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  const newUsers = index >= 0
    ? users.map(u => u.id === updatedUser.id ? updatedUser : u)
    : [...users, updatedUser];

  setCachedUsers(newUsers);

  // Send update to SQLite database backend
  fetch(`/api/users/${updatedUser.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
  }).catch(err => console.error('Failed to sync user update to DB:', err));

  return newUsers;
};

// --- Saved Listings ---
export const fetchSavedListingsAsync = async (userId: number): Promise<number[]> => {
  try {
    const res = await fetch(`/api/users/${userId}/saved-listings`);
    if (res.ok) {
      const savedIds = await res.json();
      const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
      allData[userId] = { savedListings: savedIds };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(allData));
      return savedIds;
    }
  } catch (e) {}
  const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
  return allData[userId]?.savedListings || [];
};

export const getSavedListings = (userId: number): number[] => {
  fetchSavedListingsAsync(userId).catch(() => {});
  const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
  return allData[userId]?.savedListings || [];
};

export const updateSavedListings = (userId: number, savedIds: number[]): void => {
  const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
  allData[userId] = { savedListings: savedIds };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(allData));

  fetch(`/api/users/${userId}/saved-listings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ savedIds })
  }).catch(err => console.error('Failed to sync saved listings to DB:', err));
};
