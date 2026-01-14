"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import ResumeForm from "@/components/builder/ResumeForm";
import DesignPanel from "@/components/builder/DesignPanel";

// Refactored Components
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderPreview } from "@/components/builder/BuilderPreview";
import { BuilderMobileToggle } from "@/components/builder/BuilderMobileToggle";

// Custom Hooks
import { useDebounce } from "@/hooks/useDebounce";
import { useBuilderTemplates } from "@/hooks/useBuilderTemplates";
import { useBuilderScaling } from "@/hooks/useBuilderScaling";
import { useBuilderPreview } from "@/hooks/useBuilderPreview";

/**
 * BuilderPage - The main resume builder interface.
 * 
 * Reorganized into a clean, modular structure using specialized components and hooks.
 * - Manages the high-level layout and view state (mobile vs desktop, edit vs design).
 * - Orchestrates data flow between the store, the editor, and the live preview.
 */
export default function BuilderPage() {
  // 1. Store State
  const { resume, exportSettings } = useClientResumeStore(
    useCallback((state) => ({ 
      resume: state.resume, 
      exportSettings: state.exportSettings
    }), [])
  );

  // 2. Local View State
  const [isClient, setIsClient] = useState(false);
  const [panelView, setPanelView] = useState<'edit' | 'design'>('edit');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  
  // 3. Debounced Data for Performance
  const debouncedResume = useDebounce(resume, 200);
  const debouncedSettings = useDebounce(exportSettings, 200);

  // 4. Custom Hooks for Core Logic
  const { rawTemplate, isLoading, error, setSelectedTemplate, selectedTemplate } = useBuilderTemplates();
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useBuilderScaling(containerRef);
  const previewHtml = useBuilderPreview(rawTemplate, debouncedResume, debouncedSettings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 5. Actions
  const handleDownloadPdf = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  const handleRetry = () => {
    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate);
    }
  };

  return (
    <main className="flex flex-col bg-gray-100 h-screen overflow-hidden text-black relative">
      {/* Mobile-only toggle for switching between Editor and Preview */}
      <BuilderMobileToggle 
        mobileView={mobileView} 
        setMobileView={setMobileView} 
      />

      <div className="flex flex-col md:flex-row grow overflow-hidden p-4 md:p-8 gap-4 md:gap-8">
        
        {/* LEFT PANEL: Controls (Form or Design) */}
        <div className={`md:w-1/3 overflow-y-auto shrink-0 flex flex-col gap-4 ${
          mobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header with View Toggles and Download Action */}
          <BuilderHeader 
            panelView={panelView} 
            setPanelView={setPanelView} 
            handleDownloadPdf={handleDownloadPdf} 
          />

          {/* Panel Content: Either the Resume Form or the Design Settings */}
          <div className="grow overflow-y-auto pr-1">
            {panelView === 'edit' ? (
              <ResumeForm />
            ) : (
              <DesignPanel />
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview */}
        <div className={`flex-1 flex flex-col min-w-0 ${
          mobileView === 'edit' ? 'hidden md:flex' : 'flex'
        }`}>
          <BuilderPreview 
            isClient={isClient}
            previewHtml={previewHtml}
            scale={scale}
            containerRef={containerRef}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        </div>

      </div>
    </main>
  );
}
