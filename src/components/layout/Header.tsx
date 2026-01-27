'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';   
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';


// --- CONFIG ---
// In development, Auth is on port 3001. In production, this would be 'auth.smrtcv.com'
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4001';

const navLinks = [
  { href: '/faq', label: 'FAQs' },
  { href: '/about', label: 'About' },
  { href: ROUTES.SIGNIN, label: 'Sign In', external: true },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide the landing header on dashboard-related routes as they have their own DashboardHeader
  const isDashboardRoute = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/resumes') || 
                          pathname?.startsWith('/templates') || 
                          pathname?.startsWith('/account');

  if (isDashboardRoute) {
    return null;
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-8xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-200">
            <span className="text-xl font-black tracking-tighter">S</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
            smrt<span className="text-blue-600 group-hover:text-gray-900">cv</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/faq"
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            FAQs
          </Link>
          <Link
            href="/about"
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          
          <div className="h-4 w-[1px] bg-border mx-2" />

          <a
            href={ROUTES.SIGNIN}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            Sign In
          </a>
          <Button asChild variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-lg px-6">
            <a href={ROUTES.SIGNIN}>Create Resume as Guest</a>
          </Button>
        </nav>

        {/* --- Mobile Menu & Controls --- */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="outline" size="sm">
            <a href={ROUTES.SIGNIN}>Create Resume</a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <div
        className={cn(
          'border-t border-border md:hidden',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <nav className="flex flex-col items-start gap-4 p-4">
          <Link
            href="/faq"
            onClick={handleLinkClick}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            FAQs
          </Link>
           <Link
            href="/about"
            onClick={handleLinkClick}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/pricing"
            onClick={handleLinkClick}
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <a
            href={ROUTES.SIGNIN}
            className="font-semibold text-foreground"
          >
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
};

