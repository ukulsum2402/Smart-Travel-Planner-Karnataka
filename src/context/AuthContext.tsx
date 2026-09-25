import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TravelStyle } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password?: string; travelStyle?: TravelStyle; interests?: string[] }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);

    // Sync with backend API if token is present
    authService.syncCurrentUser().then(synced => {
      if (synced) setUser(synced);
    });
  }, []);

  const login = async (email: string, password?: string) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
  };

  const register = async (data: { name: string; email: string; password?: string; travelStyle?: TravelStyle; interests?: string[] }) => {
    const newUser = await authService.register(data);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
