import { useMemo, useEffect, useState } from "react";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { Resume } from "@/types/resume";
import { FormConfig, SectionConfig } from "@/stores/resumeStore";
import { FORM_TEMPLATES } from "@/config/form-templates";

interface DynamicFormOverrides {
  formOverrides?: {
    sections?: Record<string, Partial<SectionConfig>>;
    version?: string;
  };
}

/**
 * Hook to manage dynamic form configurations.
 * Reactive to template changes and global config updates.
 */
export function useDynamicForm(templateConfig: DynamicFormOverrides | null = null) {
  const { formConfig, selectedTemplate } = useClientResumeStore(
    useShallow((state) => ({ 
      formConfig: state.formConfig,
      selectedTemplate: state.selectedTemplate 
    }))
  );
  
  const { updateFormConfig } = useResumeActions();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1. Merge template-specific overrides from FORM_TEMPLATES and templateConfig
  useEffect(() => {
    const baseTemplateConfig = FORM_TEMPLATES[selectedTemplate || ""] || {};
    
    // If no specific template configuration found, use a default or empty
    if (!selectedTemplate) {
      // Could potentially reset to a default state here
    }

    const rawMergedSections = { 
      ...formConfig.sections, 
      ...(baseTemplateConfig.sections || {}),
      ...(templateConfig?.formOverrides?.sections || {}) 
    };

    // Filter out invalid sections (like 'summary' if it accidentally leaked in)
    const validSectionKeys: (keyof Resume)[] = [
      'basics', 'work', 'education', 'skills', 'projects', 'awards', 
      'certificates', 'publications', 'languages', 'interests', 
      'volunteer', 'references', 'advisory'
    ];

    const mergedSections = (Object.keys(rawMergedSections) as (keyof Resume)[])
      .filter(key => validSectionKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = rawMergedSections[key] as SectionConfig;
        return obj;
      }, {} as Record<keyof Resume, SectionConfig>);

    // Check if we actually need to update to avoid loops
    const hasChanges = (Object.entries(mergedSections) as [keyof Resume, SectionConfig][]).some(
      ([key, val]) => {
        const current = formConfig.sections[key];
        if (!current) return true;
        
        const basicChanged = current.visible !== val.visible || 
                             current.order !== val.order || 
                             current.title !== val.title;
        
        const fieldsChanged = JSON.stringify(current.fields) !== JSON.stringify(val.fields);
        
        return basicChanged || fieldsChanged;
      }
    );

    if (hasChanges) {
      setIsTransitioning(true);
      updateFormConfig({
        sections: mergedSections,
        version: templateConfig?.formOverrides?.version || formConfig.version
      });
      
      // Reset transitioning state after a short delay for smooth UI feel
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate, templateConfig?.formOverrides, updateFormConfig, formConfig.sections, formConfig.version]);

  // 2. Computed dynamic sections based on visibility and order
  const activeSections = useMemo(() => {
    // Define valid resume section keys to filter out any stray fields that might have leaked into sections
    const validSectionKeys = [
      'basics', 'work', 'education', 'skills', 'projects', 'awards', 
      'certificates', 'publications', 'languages', 'interests', 
      'volunteer', 'references', 'advisory'
    ];

    return (Object.keys(formConfig.sections) as (keyof Resume)[])
      .filter(key => validSectionKeys.includes(key) && formConfig.sections[key]?.visible)
      .sort((a, b) => (formConfig.sections[a]?.order || 0) - (formConfig.sections[b]?.order || 0));
  }, [formConfig.sections]);

  return {
    config: formConfig,
    activeSections,
    updateFormConfig,
    isTransitioning
  };
}
