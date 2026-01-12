import React from 'react';

/**
 * ResumePreviewSkeleton Component
 * Displays a pulsing loading state that mimics the structure of a resume.
 */
export function ResumePreviewSkeleton() {
  return (
    <div className="p-10 h-full w-full bg-white animate-pulse flex flex-col gap-6">
      {/* Header Area */}
      <div className="space-y-3">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mt-2" />
      </div>
      
      {/* Content Blocks */}
      <div className="grid grid-cols-1 gap-8 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded border-b border-gray-300 pb-1" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
            <div className="h-4 w-4/6 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
