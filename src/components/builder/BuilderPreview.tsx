import React from 'react';
import { ResumePreviewSkeleton } from './ResumePreviewSkeleton';
import { AlertCircle, RefreshCw, FileX } from 'lucide-react';

interface BuilderPreviewProps {
  isClient: boolean;
  previewHtml: string | null;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * BuilderPreview Component
 * Renders the resume preview inside a scaled container. 
 * Uses an iframe for sandboxed HTML/CSS rendering.
 */
export const BuilderPreview = ({ 
  isClient, 
  previewHtml, 
  scale, 
  containerRef,
  isLoading,
  error,
  onRetry
}: BuilderPreviewProps) => {
  // 1. Loading State
  if (!isClient || isLoading || (!previewHtml && !error)) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <ResumePreviewSkeleton />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load template</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          {error || "We encountered an issue while fetching the template resources. Please try again."}
        </p>
        <button
          onClick={() => onRetry ? onRetry() : window.location.reload()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  // 3. Empty State (No HTML and no error)
  if (!previewHtml) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <FileX className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No preview available</h3>
        <p className="text-gray-500">Select a template to see your resume preview.</p>
      </div>
    );
  }

  // 4. Success State: Render Iframe
  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>} 
      className="flex-1 bg-gray-200/50 rounded-2xl overflow-auto custom-scrollbar flex justify-center p-8"
    >
      <div 
        className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out"
        style={{ 
          width: '794px', // A4 Width at 96 DPI
          minHeight: '1123px', // A4 Height at 96 DPI
          transform: `scale(${scale})` 
        }}
      >
        <iframe
          title="Resume Preview"
          srcDoc={previewHtml}
          className="w-full h-[1123px] border-none"
        />
      </div>
    </div>
  );
};
