import React from 'react';

interface CenteredTextSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * CenteredTextSection Component
 * A reusable layout component for centered text sections with a title.
 */
export const CenteredTextSection = ({ title, children }: CenteredTextSectionProps) => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <div className="mt-6 space-y-6 text-lg text-foreground-secondary">
          {children}
        </div>
      </div>
    </div>
  </section>
);
