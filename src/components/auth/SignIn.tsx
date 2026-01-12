'use client';

import { Button } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { UserData } from '@/types/user';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

interface SignInProps {
  data: UserData | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const SignIn = ({ data, isLoading, error }: SignInProps) => {
  const userEmail = data?.data?.[0]?.account?.email;
  const userName = data?.data?.[0]?.account?.name?.fullName;

  const handleLogin = () => {
    let nextPath = '/builder';
    try {
      const params = new URLSearchParams(window.location.search);
      const n = params.get('next');
      if (n && n.startsWith('/')) nextPath = n;
    } catch {}
    window.location.href = `${APP_URL}${nextPath}`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error loading user data: {error.message}</p>}
          {userEmail && <p className="mb-4 text-sm text-foreground-secondary">{userEmail}</p>}
          {userName && <p className="mb-4 text-sm">Welcome, {userName}</p>}
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign In
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Welcome back, let&apos;s pick up where you left off.
          </p>
          
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button variant="secondary" size="lg" className="w-full" onClick={handleLogin}>
              <GoogleIcon className="mr-2 h-5 w-5 fill-current" />
              Google
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={handleLogin}>
              <LinkedInIcon className="mr-2 h-5 w-5" />
              LinkedIn
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
