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
  Trophy,
  Linkedin,
  ScanSearch,
  X,
  AlertTriangle,
  Lightbulb,
  Info,
  Cloud,
  History,
  RotateCcw,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { Resume } from "@/types/resume";
import { calculateResumeScore } from "@/lib/scoring";
import { analyzeATSCompatibility, ATSAnalysisResult } from "@/lib/ats-service";

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
  basics: { title: "Personal Details", component: BasicsForm },
  work: { title: "Employment History", component: WorkForm },
  education: { title: "Education", component: EducationForm },
  skills: { title: "Skills", component: SkillsForm },
  projects: { title: "Projects", component: ProjectsForm },
  awards: { title: "Awards", component: AwardsForm },
  certificates: { title: "Certificates", component: CertificatesForm },
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
  children: React.ReactNode;
}

function DraggableAccordion({ id, title, isOpen, onToggle, children }: AccordionProps) {
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
            <span className="text-lg font-bold text-gray-800">{title}</span>
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

export default function ResumeForm() {
  const { 
    resume, 
    sectionOrder, 
    reorderSections,
    versions,
    saveVersion,
    restoreVersion,
    deleteVersion,
    selectedTemplate
  } = useClientResumeStore(useCallback((state) => ({
    resume: state.resume,
    sectionOrder: state.sectionOrder, 
    reorderSections: state.reorderSections,
    versions: state.versions,
    saveVersion: state.saveVersion,
    restoreVersion: state.restoreVersion,
    deleteVersion: state.deleteVersion,
    selectedTemplate: state.selectedTemplate
  }), []), shallow);

  const scoreData = useMemo(() => calculateResumeScore(resume), [resume]);
  const atsData = useMemo(() => analyzeATSCompatibility(resume), [resume]);

  const [showATSModal, setShowATSModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCloudSave = () => {
    const name = prompt("Enter a name for this version:", `Version ${versions.length + 1} (${new Date().toLocaleDateString()})`);
    if (name) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        saveVersion(name);
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 800);
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

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Editor State: Track which accordion is open
  const [expandedSection, setExpandedSection] = useState<keyof Resume | null>('basics');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Filter sections based on the active template
  const activeSections = useMemo(() => {
    return sectionOrder.filter(key => {
      if (selectedTemplate !== 'traditional' && key === 'advisory') return false;
      return true;
    });
  }, [sectionOrder, selectedTemplate]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as keyof Resume);
      const newIndex = sectionOrder.indexOf(over?.id as keyof Resume);
      reorderSections(arrayMove(sectionOrder, oldIndex, newIndex));
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

  // --- RENDER: WIZARD MODE ---
  const renderWizard = () => {
    const currentSectionKey = activeSections[stepIndex];
    const CurrentComponent = SECTION_CONFIG[currentSectionKey].component;
    const progress = ((stepIndex + 1) / activeSections.length) * 100;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full max-h-[calc(100vh-220px)]">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {SECTION_CONFIG[currentSectionKey].title}
            </h2>
            <button 
              onClick={() => setMode('editor')} 
              className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3" />
              Skip to Overview
            </button>
          </div>
          {mounted && (
            <>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">Step {stepIndex + 1} of {activeSections.length}</p>
            </>
          )}
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <CurrentComponent selectedTemplate={selectedTemplate} />
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-xl">
          <button
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md"
          >
            {stepIndex === activeSections.length - 1 ? "Finish" : "Next"}
            {stepIndex === activeSections.length - 1 ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  };

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
      <div className="flex-grow overflow-y-auto pr-2 pb-10">
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
              const { title, component: Component } = SECTION_CONFIG[key];
              return (
                <DraggableAccordion
                  key={key}
                  id={key}
                  title={title}
                  isOpen={expandedSection === key}
                  onToggle={() => setExpandedSection(prev => prev === key ? null : key)}
                >
                  <Component selectedTemplate={selectedTemplate} />
                </DraggableAccordion>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Top Utility Bar: Score & Integrations */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {mounted ? (
              <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700 whitespace-nowrap">Score: {scoreData.score}%</span>
              </div>
            ) : (
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-full flex-shrink-0" />
            )}

            <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />

            {/* Cloud Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={handleCloudSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm font-medium whitespace-nowrap ${
                  saveSuccess 
                    ? 'bg-green-100 border-green-200 text-green-700' 
                    : 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Cloud Save'}
              </button>

              <button 
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors text-sm font-medium whitespace-nowrap"
                title="Version History"
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>

            <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />

            <button 
              onClick={() => setShowATSModal(true)}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100 hover:bg-purple-100 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <ScanSearch className="w-4 h-4" />
              ATS Checker
            </button>
            
            <button 
              onClick={handleLinkedInImport}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#0077b5] text-white rounded-full hover:bg-[#006097] transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Linkedin className="w-4 h-4 fill-current" />
              Import LinkedIn
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium overflow-hidden">
            {mounted && (
              scoreData.suggestions.length > 0 ? (
                <span className="animate-pulse text-orange-500 truncate">Tip: {scoreData.suggestions[0]}</span>
              ) : (
                <span className="text-green-500 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle className="w-3 h-3" /> Resume looking great!
                </span>
              )
            )}
          </div>
        </div>
      </div>

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

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Version History</h2>
                  <p className="text-sm text-gray-500">Restore or manage previous versions of your resume</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {versions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Cloud className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No versions yet</h3>
                  <p className="text-gray-500 max-w-xs mt-1">
                    Save your resume to the cloud to create versions you can restore later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.slice().reverse().map((version) => (
                    <div 
                      key={version.id}
                      className="group p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {version.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(version.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            if (confirm('Restore this version? Current unsaved changes will be lost.')) {
                              restoreVersion(version.id);
                              setShowHistoryModal(false);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Delete this version?')) {
                              deleteVersion(version.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS Compatibility Modal */}
      {showATSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <ScanSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ATS Compatibility Scan</h3>
                  <p className="text-purple-100 text-xs">AI-powered analysis for recruiter systems</p>
                </div>
              </div>
              <button 
                onClick={() => setShowATSModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Score Section */}
              <div className="flex flex-col items-center justify-center p-8 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                <div className="relative mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-100" />
                    <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 * (1 - atsData.score / 100)}
                      className="text-purple-600 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-purple-900">{atsData.score}%</span>
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">ATS Score</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-purple-800">
                  {atsData.score >= 80 ? "Excellent compatibility! Your resume is highly ATS-friendly." : 
                   atsData.score >= 50 ? "Good start, but some critical improvements are needed." : 
                   "Your resume needs significant optimization for ATS systems."}
                </p>
              </div>

              {/* Critical Issues */}
              {atsData.criticalIssues.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Critical Issues</h4>
                  </div>
                  <div className="grid gap-2">
                    {atsData.criticalIssues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <p className="text-sm text-red-800 font-medium">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimization Suggestions */}
              {atsData.suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Lightbulb className="w-5 h-5" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Optimization Tips</h4>
                  </div>
                  <div className="grid gap-2">
                    {atsData.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <Info className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-sm text-blue-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Density */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <LayoutDashboard className="w-5 h-5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider">Keyword Density</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(atsData.keywordDensity).length > 0 ? (
                    Object.entries(atsData.keywordDensity).map(([keyword, count], idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                        <span className="text-xs font-bold text-gray-700">{keyword}</span>
                        <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-gray-300 text-gray-500">{count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No industry-standard keywords detected yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowATSModal(false)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                Got it, let's fix these
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
