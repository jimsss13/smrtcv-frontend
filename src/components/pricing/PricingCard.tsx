import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

interface PricingCardProps {
}

/**
 * PricingCard component
 * Displays the main subscription plan details, including price, features, and CTA
 */
export const PricingCard = ({ }: PricingCardProps) => {
  const features = [
    'Access to professional CV and cover letter builder',
    'Choose from modern, recruiter-approved templates',
    'Unlimited editing and formatting',
    'Quick setup — create your CV in minutes',
    'Tailored templates for every industry',
    'Affordable short-term access for job seekers',
  ];

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md bg-[#1f4fd8] rounded-3xl shadow-2xl px-8 md:px-10 py-14 text-white">
        {/* Icon / Illustration Holder */}
        <div className="relative w-full overflow-visible">
          <Image 
            src="/pricing.png" 
            alt="Pricing Icon" 
            width={220}  
            height={220} 
            className="object-contain -mt-8 mb-5 mx-auto"
            suppressHydrationWarning
          />
        </div>

        <p className="text-sm text-white/80 mb-8">
          Just pay
        </p>

        {/* Price */}
        <div className="mb-8">
          <span className="block text-6xl font-bold mb-8">€2.99</span>
          <p className="text-sm text-white/80">
            for 14 days unlimited access
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="secondary"
          size="lg"
          className="w-full rounded-xl bg-white border border-white text-[#1f4fd8] font-bold text-lg hover:bg-[#1f4fd8] hover:text-white mb-10"
          asChild
        >
          <a href={ROUTES.SIGNIN}>Start Today</a>
        </Button>

        {/* Divider */}
        <div className="h-px bg-white/20 mb-8" />

        {/* Features */}
        <ul className="space-y-4 text-sm text-left">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white text-[#1f4fd8] flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                ✓
              </span>
              <span className="text-white/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
