/**
 * PricingHeader component
 * Displays the main title and description for the pricing page
 */
export const PricingHeader = () => {
  return (
    <div className="relative max-w-6xl mx-auto text-center mb-16">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">
        Subscription Plan
      </h1>
      <p className="text-lg md:text-xl text-foreground-secondary">
        Avail our service for a very affordable price! <br className="hidden md:block" />
        <b className="text-foreground">No auto-renewals!</b>
      </p>
    </div>
  );
};
