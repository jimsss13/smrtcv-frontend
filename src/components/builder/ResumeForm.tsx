"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  LayoutDashboard,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientResumeStore, useResumeActions, useSectionErrors } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { Resume } from "@/types/resume";
import { calculateResumeScore } from "@/lib/scoring";
import { analyzeATSCompatibility } from "@/lib/ats-service";
import { resumeService } from "@/services/resumeService";

// Refactored Components
import { UtilityBar } from "./ResumeFormUtility";
import { VersionHistoryModal, ATSModal, ImportResumeModal } from "./ResumeFormModals";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import All Form Components
import { BasicsForm } from "@/components/builder/form/BasicsForm";
import { WorkForm } from "@/components/builder/form/WorkForm";
import { EducationForm } from "@/components/builder/form/EducationForm";
import { AdvisoryForm } from "@/components/builder/form/AdvisoryForm";
import { SkillsForm } from "@/components/builder/form/SkillsForm";
import { LanguagesForm } from "@/components/builder/form/LanguagesForm";
import { InterestsForm } from "@/components/builder/form/InterestsForm";
import { ProjectsForm } from "@/components/builder/form/ProjectsForm";
import { AwardsForm } from "@/components/builder/form/AwardsForm";
import { CertificatesForm } from "@/components/builder/form/CertificatesForm";
import { PublicationsForm } from "@/components/builder/form/PublicationsForm";
import { VolunteerForm } from "@/components/builder/form/VolunteerForm";
import { ReferencesForm } from "@/components/builder/form/ReferencesForm";

// Configuration mapping keys to Titles and Components
const SECTION_CONFIG: Record<keyof Resume, { title: string; component: any }> = {
  basics: { title: "Contact Information", component: BasicsForm },
  work: { title: "Work Experience", component: WorkForm },
  education: { title: "Education", component: EducationForm },
  skills: { title: "Skills", component: SkillsForm },
  projects: { title: "Projects", component: ProjectsForm },
  awards: { title: "Awards & Honors", component: AwardsForm },
  certificates: { title: "Certifications", component: CertificatesForm },
  languages: { title: "Languages", component: LanguagesForm },
  interests: { title: "Interests", component: InterestsForm },
  publications: { title: "Publications", component: PublicationsForm },
  volunteer: { title: "Volunteer Experience", component: VolunteerForm },
  references: { title: "References", component: ReferencesForm },
  advisory: { title: "Advisory Roles", component: AdvisoryForm },
};

// --- Draggable Accordion Item Component ---
interface AccordionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  errorCount?: number;
  children: React.ReactNode;
}

function DraggableAccordion({ id, title, isOpen, onToggle, errorCount, children }: AccordionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 rounded-xl border transition-all bg-white shadow-sm ${
        isDragging ? 'shadow-2xl scale-105 ring-2 ring-blue-500 opacity-90' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header Row */}
      <div 
        className={`flex items-center p-4 select-none ${isOpen ? 'border-b border-gray-100' : ''}`}
      >
        {/* Drag Handle */}
        <button 
          {...attributes} 
          {...listeners} 
          className="p-2 mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Title & Toggle Area */}
        <div 
          className="flex-grow flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">{title}</span>
              {errorCount && errorCount > 0 ? (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {errorCount}
                </span>
              ) : null}
            </div>
            {!isOpen && (
              <span className="text-xs text-gray-400 font-medium">Click to expand</span>
            )}
          </div>
          
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content Body */}
      {isOpen && (
        <div className="p-5 bg-gray-50/50 rounded-b-xl animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );
}

function DynamicAccordionItem({ 
  sectionKey, 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  sectionKey: string; 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode; 
}) {
  const errors = useSectionErrors(sectionKey);
  return (
    <DraggableAccordion
      id={sectionKey}
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      errorCount={errors.length}
    >
      {children}
    </DraggableAccordion>
  );
}

// --- Wizard Step Component ---
// FIXED: Moved outside ResumeForm to prevent infinite re-creation loops.
const WizardStep = ({ 
  sectionKey, 
  stepIndex, 
  totalSteps, 
  onNext, 
  onBack, 
  onSwitchMode,
  config,
  mounted
}: { 
  sectionKey: keyof Resume; 
  stepIndex: number; 
  totalSteps: number; 
  onNext: () => void; 
  onBack: () => void; 
  onSwitchMode: () => void;
  config: any;
  mounted: boolean;
}) => {
  const sectionConfig = config.sections[sectionKey];
  const sectionMeta = SECTION_CONFIG[sectionKey];
  
  // Safety check to prevent crashes if section is missing configuration
  if (!sectionMeta || !sectionConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h3 className="text-lg font-bold text-gray-900">Section Not Configured</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          The section "{sectionKey}" is missing its component or configuration.
        </p>
        <button onClick={onNext} className="text-blue-600 font-bold hover:underline">
          Skip this step
        </button>
      </div>
    );
  }

  const CurrentComponent = sectionMeta.component;
  const errors = useSectionErrors(sectionKey);
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Step Header */}
      <div className="p-6 pb-4 border-b border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {sectionConfig.title}
              </h2>
              {errors.length > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {errors.length} Errors
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step {stepIndex + 1} of {totalSteps}</span>
            </div>
          </div>
          <button 
            onClick={onSwitchMode} 
            className="px-3 py-1.5 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-gray-100"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Switch to Editor
          </button>
        </div>
        
        {mounted && (
          <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          <CurrentComponent />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
        <button
          onClick={onBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all disabled:opacity-30 disabled:pointer-events-none uppercase tracking-wide"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        
        <button
          onClick={onNext}
          className="group flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all uppercase tracking-widest"
        >
          {stepIndex === totalSteps - 1 ? "Complete" : "Continue"}
          {stepIndex === totalSteps - 1 
            ? <CheckCircle className="w-3.5 h-3.5" /> 
            : <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          }
        </button>
      </div>
    </div>
  );
};

export default function ResumeForm() {
  const { 
    resume, 
    resumeId,
    resumeTitle,
    versions, 
    saveVersion, 
    restoreVersion, 
    deleteVersion 
  } = useClientResumeStore(useShallow((state) => ({
    resume: state.resume,
    resumeId: state.resumeId,
    resumeTitle: state.resumeTitle,
    versions: state.versions,
    saveVersion: state.saveVersion,
    restoreVersion: state.restoreVersion,
    deleteVersion: state.deleteVersion
  })));

  const { 
    reorderSections, 
    setResume,
    setResumeId,
    setResumeTitle 
  } = useResumeActions();
  const { activeSections, config, isTransitioning } = useDynamicForm();

  const scoreData = useMemo(() => calculateResumeScore(resume), [resume]);
  const atsData = useMemo(() => analyzeATSCompatibility(resume), [resume]);

  const [showATSModal, setShowATSModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCloudSave = async () => {
    const title = prompt("Enter a name for this resume:", resumeTitle || "Untitled Resume");
    if (title) {
      setIsSaving(true);
      try {
        let dbResume;
        if (resumeId) {
          dbResume = await resumeService.updateResume(resumeId, title, resume);
        } else {
          dbResume = await resumeService.createResume(title, resume);
          setResumeId(dbResume.id);
        }
        setResumeTitle(title);
        
        // Also save to local version history
        saveVersion(title);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error("Failed to save resume:", error);
        alert("Failed to save resume. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleLinkedInImport = () => {
    alert("LinkedIn Import feature is being initialized. In a real app, this would open an OAuth flow.");
  };
  
  // Modes: Wizard (Guided) vs Editor (Free-form)
  const [mode, setMode] = useState<'wizard' | 'editor'>('wizard');
  
  // Wizard State
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Auto-reset step if current step is out of bounds after a template change
  useEffect(() => {
    if (stepIndex >= activeSections.length) {
      setStepIndex(0);
    }
  }, [activeSections.length, stepIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Editor State: Track which accordion is open
  const [expandedSection, setExpandedSection] = useState<keyof Resume | null>('basics');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sections to display is now handled by useDynamicForm hook

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activeSections.indexOf(active.id as keyof Resume);
      const newIndex = activeSections.indexOf(over?.id as keyof Resume);
      reorderSections(arrayMove(activeSections, oldIndex, newIndex));
    }
  };

  // --- Wizard Handlers ---
  const handleNext = () => {
    if (stepIndex < activeSections.length - 1) {
      setStepIndex(s => s + 1);
    } else {
      setMode('editor');
      setExpandedSection('basics');
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(s => s - 1);
  };

  const renderWizard = () => (
    <div className="relative h-full">
      {/* Visual indicator for form layout changes */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Optimizing Form for {resume.metadata?.template || "Template"}...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`h-full transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-[0.98] blur-[1px]' : 'opacity-100 scale-100 blur-0'}`}>
        <WizardStep 
          sectionKey={activeSections[stepIndex]}
          stepIndex={stepIndex}
          totalSteps={activeSections.length}
          onNext={handleNext}
          onBack={handleBack}
          onSwitchMode={() => setMode('editor')}
          config={config}
          mounted={mounted}
        />
      </div>
    </div>
  );

  // --- RENDER: EDITOR MODE (Accordion List) ---
  const renderEditor = () => (
    <div className="h-full max-h-[calc(100vh-220px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex justify-between items-end px-1">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Edit Resume</h2>
          <p className="text-sm text-gray-500">Drag sections to reorder • Expand to edit</p>
        </div>
        <button 
          onClick={() => setMode('wizard')}
          className="text-xs text-blue-600 hover:underline font-medium"
        >
          Restart Wizard
        </button>
      </div>

      {/* Scrollable Accordion List */}
      <div className="flex-grow overflow-y-auto pr-2 pb-10 custom-scrollbar">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={activeSections} 
            strategy={verticalListSortingStrategy}
          >
            {activeSections.map((key) => {
              const sectionMeta = SECTION_CONFIG[key];
              const sectionConfig = config.sections[key];
              
              if (!sectionMeta || !sectionConfig) return null;
              
              const { component: Component } = sectionMeta;
              return (
                <DynamicAccordionItem
                  key={key}
                  sectionKey={key}
                  title={sectionConfig.title}
                  isOpen={expandedSection === key}
                  onToggle={() => setExpandedSection(prev => prev === key ? null : key)}
                >
                  <Component />
                </DynamicAccordionItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      <UtilityBar 
        scoreData={scoreData}
        mounted={mounted}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onCloudSave={handleCloudSave}
        onShowHistory={() => setShowHistoryModal(true)}
        onShowATS={() => setShowATSModal(true)}
        onLinkedInImport={handleLinkedInImport}
        onImportResume={() => setShowImportModal(true)}
      />

      <div className="flex-grow p-4 overflow-hidden">
        {mounted ? (
          mode === 'wizard' ? renderWizard() : renderEditor()
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium animate-pulse">Loading your resume...</p>
          </div>
        )}
      </div>

      {showHistoryModal && (
        <VersionHistoryModal 
          versions={versions}
          onClose={() => setShowHistoryModal(false)}
          onRestore={(id) => {
            if (confirm('Restore this version? Current unsaved changes will be lost.')) {
              restoreVersion(id);
              setShowHistoryModal(false);
            }
          }}
          onDelete={(id) => {
            if (confirm('Delete this version?')) {
              deleteVersion(id);
            }
          }}
        />
      )}

      {showImportModal && (
        <ImportResumeModal 
          onClose={() => setShowImportModal(false)}
          onImportSuccess={(data) => {
            setResume(data);
            setShowImportModal(false);
          }}
        />
      )}

      {showATSModal && (
        <ATSModal 
          atsData={atsData}
          onClose={() => setShowATSModal(false)}
        />
      )}
    </div>
  );
}
