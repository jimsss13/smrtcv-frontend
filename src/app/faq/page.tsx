import React from 'react';
import { FaqHeader } from '@/components/faq/FaqHeader';
import { FaqSidebar } from '@/components/faq/FaqSidebar';
import { FaqContent } from '@/components/faq/FaqContent';

/**
 * FaqPage Component (Server Component)
 * The main page for browsing frequently asked questions.
 */
export default function FaqPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Page Header (Static) */}
        <FaqHeader />

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Content Area: Search and Accordion (Interactive) */}
          <FaqContent />

          {/* Sticky Sidebar Area (Static) */}
          <FaqSidebar />
        </div>
      </div>
    </div>
  );
}
