import Link from 'next/link';

/**
 * PricingFooter component
 * Displays trust information and links to FAQ
 */
export const PricingFooter = () => {
  return (
    <div className="mt-20 max-w-2xl mx-auto text-center">
      <p className="text-base text-foreground-secondary mb-6">
        No long-term commitment. Cancel anytime. You’re always in control.
      </p>

      <Link
        href="/faq"
        className="text-[#0070f3] text-base md:text-lg font-bold hover:underline"
      >
        View FAQs for more information
      </Link>
    </div>
  );
};
