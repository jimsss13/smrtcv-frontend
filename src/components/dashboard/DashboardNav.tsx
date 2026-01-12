'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Shared Navigation Tabs for the Dashboard area.
 * Automatically highlights the active tab based on the current pathname.
 */
export const DashboardNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Resumes', href: '/resumes', icon: FileText },
    { label: 'Templates', href: '/templates', icon: Palette },
  ];

  return (
    <nav className="flex flex-row gap-2 sm:gap-4 md:gap-6 mb-10 md:mb-16 px-2 md:px-0 overflow-x-auto no-scrollbar pb-2 md:pb-0" aria-label="Dashboard navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 md:gap-4 py-2 md:py-4 px-3 md:px-8 rounded-full border-2 transition-all duration-300 min-w-[110px] sm:min-w-0",
              isActive 
                ? "bg-primary/10 border-primary font-bold text-xs sm:text-base md:text-lg text-primary shadow-sm" 
                : "bg-white border-gray-300 font-medium text-xs sm:text-base md:text-lg text-foreground-secondary hover:bg-gray-50 hover:border-gray-400"
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <item.icon 
              className={cn(
                "w-4 h-4 md:w-6 md:h-6 transition-colors shrink-0",
                isActive ? "text-primary" : "text-gray-400"
              )} 
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
