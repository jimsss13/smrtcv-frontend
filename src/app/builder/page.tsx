'use client';

import { useState, useEffect } from "react";
import ResumeForm from "@/components/builder/ResumeForm";
import DesignPanel from "@/components/builder/DesignPanel";
import { BuilderMobileToggle } from "@/components/builder/BuilderMobileToggle";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderPreview } from "@/components/builder/BuilderPreview";
import { useBuilderPreview } from "@/hooks/builder/useBuilderPreview";

/**
 * BuilderPage Component
 * The main workspace for creating and designing resumes.
 * It coordinates the editor forms, design settings, and the real-time preview.
 */
export default function BuilderPage() {
  const [isClient, setIsClient] = useState(false);
  const [panelView, setPanelView] = useState<'edit' | 'design'>('edit');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  // Logic for fetching templates and rendering the preview
  const { 
    previewHtml, 
    scale, 
    containerRef 
  } = useBuilderPreview();

  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Triggers the print dialog on the preview iframe to save as PDF.
   */
  const handleDownloadPdf = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <main className="flex flex-col bg-gray-100 h-screen overflow-hidden text-black relative">
      {/* Mobile-only toggle for Edit vs Preview */}
      <BuilderMobileToggle 
        mobileView={mobileView} 
        setMobileView={setMobileView} 
      />

      <div className="flex flex-col md:flex-row grow overflow-hidden p-4 md:p-8 gap-4 md:gap-8">
        {/* LEFT PANEL: Editor or Design Settings */}
        <div className={`md:w-1/3 overflow-y-auto shrink-0 flex flex-col gap-4 ${
          mobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header with View Toggles and Download Action */}
          <BuilderHeader 
            panelView={panelView} 
            setPanelView={setPanelView} 
            handleDownloadPdf={handleDownloadPdf} 
          />

          {/* Form / Design Toggle Content */}
          <div className="flex-1 min-h-0">
            {panelView === 'edit' ? (
              <ResumeForm />
            ) : (
              <DesignPanel />
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className={`flex-1 min-w-0 ${
          mobileView === 'edit' ? 'hidden md:flex' : 'flex'
        }`}>
          <BuilderPreview 
            isClient={isClient} 
            previewHtml={previewHtml} 
            scale={scale} 
            containerRef={containerRef} 
          />
        </div>
      </div>
    </main>
  );
}
