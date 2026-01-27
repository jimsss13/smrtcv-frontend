"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { ResumeState } from "@/stores/resumeStore";
import { useShallow } from 'zustand/react/shallow';
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
import { resumeService } from "@/services/resumeService";
import { saveAs } from "file-saver";

/**
 * BuilderPage - The main resume builder interface.
 * 
 * Reorganized into a clean, modular structure using specialized components and hooks.
 * - Manages the high-level layout and view state (mobile vs desktop, edit vs design).
 * - Orchestrates data flow between the store, the editor, and the live preview.
 */
function BuilderContent() {
  const searchParams = useSearchParams();
  const resumeIdParam = searchParams.get("id");
  const { setResume, setResumeId, setResumeTitle } = useResumeActions();

  // 1. Store State
  const { resume, exportSettings } = useClientResumeStore(
    useShallow((state: ResumeState) => ({ 
      resume: state.resume,
      exportSettings: state.exportSettings
    }))
  );

  // 2. Local View State
  const [isClient, setIsClient] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [panelView, setPanelView] = useState<'edit' | 'templates' | 'design'>('edit');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  
  // Load resume if ID is provided
  useEffect(() => {
    if (resumeIdParam) {
      const fetchResume = async () => {
        setIsFetching(true);
        try {
          const dbResume = await resumeService.getResume(resumeIdParam);
          setResume(dbResume.data);
          setResumeId(dbResume.id);
          setResumeTitle(dbResume.title);
        } catch (error) {
          console.error("Failed to fetch resume:", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchResume();
    } else {
      setResumeId(null);
      setResumeTitle("Untitled Resume");
    }
  }, [resumeIdParam, setResume, setResumeId, setResumeTitle]);
  
  // 3. Custom Hooks for Core Logic
  const { 
    rawTemplate, 
    templateConfig, 
    selectedTemplate, 
    setSelectedTemplate,
    isLoading,
    error 
  } = useBuilderTemplates();
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useBuilderScaling(containerRef);
  
  // 4. Actions
  const handleRetry = useCallback(() => {
    console.log("[BuilderPage] Retry triggered", { selectedTemplate });
    if (selectedTemplate && setSelectedTemplate) {
      setSelectedTemplate(selectedTemplate);
    } else {
      window.location.reload();
    }
  }, [selectedTemplate, setSelectedTemplate]);

  const handleDownloadPdf = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first.");
      return;
    }
    
    try {
      const blob = await resumeService.exportPdf(
        resume, 
        selectedTemplate, 
        `${resume.basics.name || 'resume'}.pdf`,
        exportSettings
      );
      saveAs(blob, `${resume.basics.name || 'resume'}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadDocx = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first.");
      return;
    }

    try {
      const blob = await resumeService.exportDocx(resume, selectedTemplate, `${resume.basics.name || 'resume'}.docx`);
      saveAs(blob, `${resume.basics.name || 'resume'}.docx`);
    } catch (error) {
      console.error("Failed to download DOCX:", error);
      alert("Failed to generate DOCX. Please try again.");
    }
  };

  // 5. Debounced Data for Performance
  const debouncedResume = useDebounce(resume, 200);
  const debouncedSettings = useDebounce(exportSettings, 200);
  const previewHtml = useBuilderPreview(rawTemplate, debouncedResume, debouncedSettings, templateConfig);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex flex-col bg-[#f8fafc] h-[calc(100vh-64px)] mt-16 overflow-hidden text-black relative">
      {/* Mobile-only toggle for switching between Editor and Preview */}
      <BuilderMobileToggle 
        mobileView={mobileView} 
        setMobileView={setMobileView} 
      />

      <div className="flex flex-col md:flex-row grow overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        
        {/* LEFT PANEL: Controls (Form or Design) */}
        <div className={`md:w-[450px] overflow-y-auto shrink-0 flex flex-col gap-3 ${
          mobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header with View Toggles and Download Action */}
          <BuilderHeader 
            panelView={panelView} 
            setPanelView={setPanelView} 
            handleDownloadPdf={handleDownloadPdf} 
            handleDownloadDocx={handleDownloadDocx}
          />

          {/* Panel Content: Either the Resume Form, Template Selection, or Design Settings */}
          <div className="grow overflow-y-auto pr-1">
            {panelView === 'edit' ? (
              <ResumeForm />
            ) : (
              <DesignPanel view={panelView === 'templates' ? 'templates' : 'settings'} />
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
            onRetry={handleRetry}
            isLoading={isLoading}
            error={error}
          />
        </div>

      </div>
    </main>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
