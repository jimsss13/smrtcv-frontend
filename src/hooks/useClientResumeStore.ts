import { useEffect, useState, useMemo } from 'react';
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
  // 1. Initialize with a stable default value
  const [state, setState] = useState<T>(() => selector(useResumeStore.getState()));

  useEffect(() => {
    // 2. Sync with the actual store immediately on mount
    setState(selector(useResumeStore.getState()));

    // 3. Subscribe to future updates
    const unsubscribe = useResumeStore.subscribe((newState) => {
      setState(selector(newState));
    });

    return () => unsubscribe();
  }, [selector]);

  return state;
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
      setResume: state.setResume,
      updateField: state.updateField,
      setValidationError: state.setValidationError,
      addSection: state.addSection,
      removeSection: state.removeSection,
      updateStringArray: state.updateStringArray,
      reorderSections: state.reorderSections,
      setTemplates: state.setTemplates,
      setSelectedTemplate: state.setSelectedTemplate,
      updateExportSettings: state.updateExportSettings,
      saveVersion: state.saveVersion,
      restoreVersion: state.restoreVersion,
      deleteVersion: state.deleteVersion,
    }))
  );
};

/**
 * Hook to get all validation errors.
 */
export const useValidationErrors = () => {
  return useResumeValue((state) => state.validationErrors || {});
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
      let current = state.resume as any;
      
      if (current === undefined || current === null) return undefined;
      
      for (const key of keys) {
        if (current === undefined || current === null) return undefined;
        current = current[key];
      }
      return current as T;
    };
  }, [path]);

  const value = useResumeValue(selector);
  const { updateField, setValidationError } = useResumeActions();
  
  const error = useResumeValue((state) => state.validationErrors?.[path]);

  const setValue = (newValue: T) => {
    // Cast to any to satisfy the complex RecursiveKeyOf type
    updateField(path as any, newValue as any);
    
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