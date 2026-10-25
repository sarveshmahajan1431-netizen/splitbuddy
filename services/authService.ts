import type { User } from '../types';

const SESSION_KEY = 'splitbuddy_session';

export const register = async (userData: { name: string, email: string, password: string }): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(errorData.error || 'Registration failed');
  }

  const newUser: User = await res.json();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, user: newUser }));
  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Invalid email or password.' }));
    throw new Error(errorData.error || 'Invalid email or password.');
  }

  const user: User = await res.json();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, user }));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUserFromSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    return parsed.user || null;
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};