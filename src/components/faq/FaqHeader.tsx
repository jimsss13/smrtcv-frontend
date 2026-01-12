import React from 'react';

/**
 * FaqHeader Component
 * Renders the top title and subtitle for the FAQ page.
 */
export const FaqHeader = () => {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 text-lg text-foreground-secondary">
        Got questions? We&apos;ve got answers.
      </p>
    </div>
  );
};
