import { useEffect, useState, useMemo, useRef } from 'react';
import { useResumeStore, ResumeState } from '@/stores/resumeStore';
import { useShallow } from 'zustand/react/shallow';
import { validateField } from '@/lib/validation';

/**
 * A hydration-safe wrapper for the Resume Store.
 * This prevents "Hydration Mismatch" errors in Next.js by ensuring 
 * the state is only synchronized after the component mounts.
 */
export const useClientResumeStore = <T>(
  selector: (state: ResumeState) => T
): T => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // During SSR and until hydration, we return the initial state from the store
  // but we must be careful not to trigger infinite loops if the selector returns a new object.
  // We use a ref to cache the initial snapshot for getServerSnapshot.
  const serverSnapshot = useRef<T | null>(null);
  const isInitialized = useRef(false);
  
  const getInitialState = () => {
    if (!isInitialized.current) {
      serverSnapshot.current = selector(useResumeStore.getState());
      isInitialized.current = true;
    }
    return serverSnapshot.current as T;
  };

  // Use useResumeStore directly
  const selectedState = useResumeStore(selector);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? selectedState : getInitialState();
};

/**
 * Hook to get a specific value from the resume store with hydration safety.
 */
export const useResumeValue = <T>(selector: (state: ResumeState) => T) => {
  return useClientResumeStore(selector);
};

/**
 * Hook to get the static actions from the store.
 * FIXED: Uses 'useShallow' to prevent infinite loops by ensuring the 
 * returned object reference remains stable unless actions actually change.
 */
export const useResumeActions = () => {
  return useResumeStore(
    useShallow((state) => ({
      setResumeId: state.setResumeId,
      setResumeTitle: state.setResumeTitle,
      setResume: state.setResume,
      updateField: state.updateField,
      setValidationError: state.setValidationError,
      addSection: state.addSection,
      removeSection: state.removeSection,
      updateStringArray: state.updateStringArray,
      reorderSections: state.reorderSections,
      updateExportSettings: state.updateExportSettings,
      saveVersion: state.saveVersion,
      restoreVersion: state.restoreVersion,
      deleteVersion: state.deleteVersion,
      updateFormConfig: state.updateFormConfig,
      toggleSectionVisibility: state.toggleSectionVisibility,
      setTemplates: state.setTemplates,
      setSelectedTemplate: state.setSelectedTemplate,
    }))
  );
};

/**
 * Hook to get all validation errors.
 * FIXED: Use useShallow to prevent infinite loops when returning a new object.
 */
export const useValidationErrors = () => {
  return useClientResumeStore(useShallow((state) => state.validationErrors || {}));
};

/**
 * Hook to get validation errors for a specific section.
 * FIXED: Memoize selector and use useShallow to prevent infinite loops.
 */
export const useSectionErrors = (section: string) => {
  const selector = useMemo(() => (state: ResumeState) => {
    const errors = state.validationErrors || {};
    return Object.keys(errors).filter(path => path.startsWith(section));
  }, [section]);
  
  return useClientResumeStore(useShallow(selector));
};

/**
 * Hook to get a specific field and its update function.
 * FIXED: Returns an array [value, setValue, error] to match 
 * usage in BasicsForm (const [value, setValue] = ...).
 */
export function useResumeField<T>(path: string) {
  // Memoize the selector to prevent unnecessary re-subscriptions
  const selector = useMemo(() => {
    return (state: ResumeState) => {
      const keys = path.split(".");
      let current: unknown = state.resume;
      
      if (current === undefined || current === null) return undefined;
      
      for (const key of keys) {
        if (current === undefined || current === null || typeof current !== 'object') return undefined;
        current = (current as Record<string, unknown>)[key];
      }
      return current as T;
    };
  }, [path]);

  const value = useResumeValue(selector);
  const { updateField, setValidationError } = useResumeActions();
  
  const error = useResumeValue((state) => state.validationErrors?.[path]);

  const setValue = (newValue: T) => {
    // Use type assertion to satisfy the complex RecursiveKeyOf type
    updateField(path as Parameters<typeof updateField>[0], newValue as Parameters<typeof updateField>[1]);
    
    // Run validation immediately
    try {
      const validationError = validateField(path, newValue);
      setValidationError(path, validationError);
    } catch (e) {
      console.warn(`Validation failed for ${path}`, e);
    }
  };

  const setError = (errorMessage: string | null) => {
    setValidationError(path, errorMessage);
  };

  // Return as const tuple (array) to fix "object is not iterable" error
  return [value, setValue, error, setError] as const;
}
