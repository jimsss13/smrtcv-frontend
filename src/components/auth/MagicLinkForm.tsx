'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4002';

export default function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [message, setMessage] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectUrl: (() => { try { const params = new URLSearchParams(window.location.search); const n = params.get('next'); if (n && n.startsWith('/')) return `${APP_URL}${n}`; } catch {} return `${APP_URL}/builder`; })() })
      });
      if (!res.ok) throw new Error('request_failed');
      setStatus('sent');
      setMessage('Check your email for the sign-in link.');
    } catch {
      setStatus('error');
      setMessage('Failed to send link. Please try again.');
    }
  }

  return (
    <div className="mt-8 w-full max-w-sm">
      <form onSubmit={sendLink} className="space-y-4">
        <label className="block text-left text-sm font-medium text-foreground">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="w-full rounded-md border border-border bg-background-card px-3 py-2 text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={status==='sending'}>
          {status==='sending' ? 'Sending…' : 'Send Verification Code'}
        </Button>
        {message && (
          <p className={`text-sm ${status==='error' ? 'text-red-600' : 'text-foreground-secondary'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

