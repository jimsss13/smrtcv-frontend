'use client';

import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardNav } from './DashboardNav';
import { useAuth } from '@/hooks/query/useAuth';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

/**
 * Layout component for all dashboard-related pages.
 * Provides consistent layout, header, and navigation.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  hideNav = false
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary selection:text-white">
      <DashboardHeader userName={user?.name || "User"} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!hideNav && <DashboardNav />}
        <div className={hideNav ? "mt-0" : "mt-8"}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};
