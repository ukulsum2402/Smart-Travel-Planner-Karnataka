import { User, TravelStyle } from '../types';
import { apiClient } from './apiClient';

const AUTH_USER_KEY = 'karnataka_travel_auth_user_v1';

const DEFAULT_USER: User = {
  id: 'user-default-1',
  name: 'Kulsum Travel Explorer',
  email: 'ukulsum2402@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  travelStyle: 'Adventure',
  interests: ['Nature', 'Trekking', 'Food', 'Waterfalls'],
  preferredSeasons: ['Winter & Peak Season (Oct – Feb)', 'Monsoon (June – Sept)'],
  budgetPreference: 'Moderate',
};

export const authService = {
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Seed default user for frictionless initial access
    this.setCurrentUser(DEFAULT_USER);
    return DEFAULT_USER;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  async syncCurrentUser(): Promise<User | null> {
    const token = apiClient.getToken();
    if (!token) return this.getCurrentUser();

    try {
      const res = await apiClient.get<{ success: boolean; user: User }>('/api/auth/me');
      if (res.success && res.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.warn('Failed to sync user with /api/auth/me:', e);
    }
    return this.getCurrentUser();
  },

  async login(email: string, password = 'password123'): Promise<User> {
    try {
      const res = await apiClient.post<{
        success: boolean;
        token?: string;
        user: User;
        message?: string;
      }>('/api/auth/login', { email, password });

      if (res.token) {
        apiClient.setToken(res.token);
      }
      if (res.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err: any) {
      console.warn('Backend login failed, using client session:', err.message);
    }

    // Client fallback session
    const existing = this.getCurrentUser();
    const user: User = {
      id: existing?.id || `user-${Date.now()}`,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Karnataka Traveler',
      email,
      avatar: existing?.avatar || DEFAULT_USER.avatar,
      travelStyle: existing?.travelStyle || 'Relaxed',
      interests: existing?.interests || ['Nature', 'Heritage', 'Food'],
      preferredSeasons: existing?.preferredSeasons || ['Winter & Peak Season (Oct – Feb)'],
      budgetPreference: existing?.budgetPreference || 'Moderate',
    };
    this.setCurrentUser(user);
    return user;
  },

  async register(params: {
    name: string;
    email: string;
    password?: string;
    travelStyle?: TravelStyle;
    interests?: string[];
  }): Promise<User> {
    try {
      const res = await apiClient.post<{
        success: boolean;
        token?: string;
        user: User;
        message?: string;
      }>('/api/auth/register', {
        name: params.name,
        email: params.email,
        password: params.password || 'password123',
        travelStyle: params.travelStyle || 'Relaxed',
        interests: params.interests || ['Nature', 'Trekking', 'Heritage'],
      });

      if (res.token) {
        apiClient.setToken(res.token);
      }
      if (res.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err: any) {
      console.warn('Backend register failed, using client session:', err.message);
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: params.name,
      email: params.email,
      avatar: DEFAULT_USER.avatar,
      travelStyle: params.travelStyle || 'Relaxed',
      interests: params.interests || ['Nature', 'Trekking', 'Heritage'],
      preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
      budgetPreference: 'Moderate',
    };
    this.setCurrentUser(user);
    return user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser() || DEFAULT_USER;
    const updated = { ...current, ...updates };

    try {
      const res = await apiClient.put<{ success: boolean; user: User }>('/api/auth/profile', updates);
      if (res.success && res.user) {
        this.setCurrentUser(res.user);
        return res.user;
      }
    } catch (err: any) {
      console.warn('Backend profile update failed, using local update:', err.message);
    }

    this.setCurrentUser(updated);
    return updated;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {}
    apiClient.setToken(null);
    this.setCurrentUser(null);
  },
};
