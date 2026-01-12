import { PricingHeader } from '@/components/pricing/PricingHeader';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PricingFooter } from '@/components/pricing/PricingFooter';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4001';

/**
 * PricingPage
 * The main pricing page component that displays the subscription plan
 */
export default function PricingPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] bg-white overflow-hidden px-4 py-20">
      {/* Background Decorations */}
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-70" />

      <div className="relative max-w-6xl mx-auto">
        <PricingHeader />
        
        <PricingCard />
        
        <PricingFooter />
      </div>
    </main>
  );
}
