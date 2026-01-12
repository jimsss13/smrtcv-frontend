'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
}

/**
 * Shared Header component for the Dashboard area.
 * Provides consistent navigation and user profile display.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/dashboard" className="flex items-center group transition-opacity hover:opacity-80">
          <Image
            src="/logo.png" 
            alt="Smart CV Logo"
            width={120} 
            height={30} 
            className="h-10 w-auto" 
            priority
            suppressHydrationWarning
          />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8">
          <Link href="/account" className="flex items-center gap-2 bg-gray-200 pl-3 sm:pl-4 pr-1 py-1 rounded-full shadow-sm hover:bg-gray-300 transition-colors">
            <span className="text-xs sm:text-sm font-bold text-foreground max-w-20 sm:max-w-none truncate">{userName}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-100" />
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
};
