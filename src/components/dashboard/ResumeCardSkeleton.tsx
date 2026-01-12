'use client';

import React from 'react';

/**
 * ResumeCardSkeleton Component
 * Displays a pulsing loading state that mimics the ResumeCard component.
 */
export const ResumeCardSkeleton = () => {
  return (
    <article className="animate-pulse relative group">
      <div className="relative aspect-4/3 bg-gray-100 border-2 border-gray-200 rounded-2xl sm:rounded-4xl shadow-sm overflow-hidden">
        {/* Resume Preview Placeholder */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="w-2/3 h-3/4 bg-white shadow-sm rounded-sm p-2 sm:p-4 flex flex-col gap-1 sm:gap-2 opacity-50">
            <div className="h-1 sm:h-2 w-1/2 bg-gray-200 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
            <div className="mt-2 sm:mt-4 h-1 sm:h-2 w-2/3 bg-gray-200 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 ml-1 space-y-2">
        <div className="h-4 sm:h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-2 sm:h-3 w-1/4 bg-gray-100 rounded" />
      </div>
    </article>
  );
};
