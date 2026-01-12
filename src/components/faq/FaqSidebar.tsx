import React from 'react';
import Image from 'next/image';

/**
 * FaqSidebar Component
 * Renders a sticky sidebar area typically used for illustrative images or additional help links.
 */
export const FaqSidebar = () => {
  return (
    <div className="flex items-start justify-center">
      {/* Changes made:
        1. Removed 'p-4' (padding) so the image touches the edges.
        2. Added 'overflow-hidden' so the image doesn't bleed outside the rounded corners.
        3. Added 'relative' so the Image with 'fill' knows what to fill.
      */}
      <div className="sticky top-24 w-full max-w-sm rounded-lg border border-border bg-background-light shadow-sm aspect-[3/4] overflow-hidden relative">
          <Image 
            src="/sample-faqs.png" 
            alt="Sample FAQs Preview" 
            fill
            className="object-cover"
            priority
            suppressHydrationWarning
            sizes="(max-width: 768px) 100vw, 384px"
          />
      </div>
    </div>
  );
};