// contexts/AuthContext.tsx
'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/query/useAuth';
import { UserData } from '@/types/user';

interface AuthContextType {
  user: UserData | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useAuth();
  
  return (
    <AuthContext.Provider value={{ user: data, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};