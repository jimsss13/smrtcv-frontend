import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * ResumePreviewSkeleton Component
 * Displays a pulsing loading state that mimics the structure of a resume.
 */
export function ResumePreviewSkeleton() {
  return (
    <div className="relative h-full w-full bg-white overflow-hidden">
      {/* Pulse Content */}
      <div className="p-10 h-full w-full animate-pulse flex flex-col gap-6 opacity-50">
        {/* Header Area */}
        <div className="space-y-3">
          <div className="h-10 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="flex gap-4 mt-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        
        {/* Content Blocks */}
        <div className="grid grid-cols-1 gap-10 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded border-b-2 border-gray-100" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-11/12 bg-gray-100 rounded" />
                <div className="h-4 w-10/12 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
        <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-gray-900">Preparing Preview</span>
            <span className="text-xs text-gray-500">Fetching template and assets...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
