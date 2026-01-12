'use client';

import { SignIn } from '@/components/auth/SignIn';
import { useAuth } from '@/hooks/query/useAuth';

export default function SignInPage() {
  const { data, isLoading, error } = useAuth();

  return <SignIn data={data} isLoading={isLoading} error={error} />;
}

