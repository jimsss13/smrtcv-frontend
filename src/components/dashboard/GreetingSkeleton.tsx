import React from 'react';

/**
 * GreetingSkeleton Component
 * Displays a pulsing loading state that mimics the GreetingSection component.
 */
export const GreetingSkeleton = () => {
  return (
    <section className="text-center mb-12 sm:mb-20 animate-pulse">
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-200 rounded-lg" />
      </div>
      <div className="flex justify-center">
        <div className="h-6 sm:h-7 w-40 sm:w-56 bg-gray-100 rounded-lg opacity-90" />
      </div>
    </section>
  );
};
