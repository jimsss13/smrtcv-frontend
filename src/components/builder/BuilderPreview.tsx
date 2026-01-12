import React from 'react';
import { ResumePreviewSkeleton } from './ResumePreviewSkeleton';

interface BuilderPreviewProps {
  isClient: boolean;
  previewHtml: string | null;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * BuilderPreview Component
 * Renders the resume preview inside a scaled container. 
 * Uses an iframe for sandboxed HTML/CSS rendering.
 */
export const BuilderPreview = ({ isClient, previewHtml, scale, containerRef }: BuilderPreviewProps) => {
  if (!isClient || !previewHtml) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <ResumePreviewSkeleton />
      </div>
    );
  }

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
