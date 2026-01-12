import { useEffect, useState, useRef, useMemo } from 'react';
import { useResumeStore, ResumeState } from '@/stores/resumeStore';
import { useShallow } from 'zustand/react/shallow';
import { validateField } from '@/lib/validation';

/**
 * A hook that safely accesses the resume store on the client side,
 * avoiding hydration mismatches by returning the server-side state
 * until the component has mounted.
 */
export const useClientResumeStore = <T,>(
  selector: (state: ResumeState) => T,
  equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Use useResumeStore with selector directly for the main subscription
  // We use useShallow if the selector returns an object
  const selectedState = useResumeStore(selector);

  // Hydration handling: return initial state until mounted
  const [hydratedState, setHydratedState] = useState<T>(() => 
    selector(useResumeStore.getState())
  );

  useEffect(() => {
    setHydratedState(selectedState);
    setIsHydrated(true);
  }, [selectedState]);

  return isHydrated ? selectedState : hydratedState;
};

/**
 * Hook to get a specific value from the resume store with hydration safety.
 */
export const useResumeValue = <T,>(selector: (state: ResumeState) => T) => {
  return useClientResumeStore(selector);
};

/**
 * Hook to get all validation errors.
 */
export const useValidationErrors = () => {
  return useResumeValue((state) => state.validationErrors);
};

/**
 * Hook to get actions from the resume store. 
 * Actions are stable and don't need hydration safety for execution,
 * but we wrap them for consistency.
 */
export const useResumeActions = () => {
  return useResumeStore(useShallow((state) => ({
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection,
    updateStringArray: state.updateStringArray,
    reorderSections: state.reorderSections,
    setTemplates: state.setTemplates,
    setSelectedTemplate: state.setSelectedTemplate,
    updateExportSettings: state.updateExportSettings,
    setValidationError: state.setValidationError,
    saveVersion: state.saveVersion,
    restoreVersion: state.restoreVersion,
    deleteVersion: state.deleteVersion,
  })));
};

/**
 * Hook to get a specific field and its update function.
 * Minimizes re-renders by only subscribing to the specific field.
 */
export function useResumeField<T>(path: string) {
  const selector = useMemo(() => {
    return (state: ResumeState) => {
      const keys = path.split(".");
      let current = state.resume as any;
      for (const key of keys) {
        if (current === undefined || current === null) return undefined;
        current = current[key];
      }
      return current as T;
    };
  }, [path]);

  const value = useResumeValue(selector);
  const { updateField, setValidationError } = useResumeActions();
  const error = useResumeValue((state) => state.validationErrors[path]);

  const setValue = (newValue: T) => {
    updateField(path as any, newValue as any);
    
    // Real-time validation
    const validationError = validateField(path, newValue);
    setValidationError(path, validationError);
  };

  const setError = (errorMessage: string | null) => {
    setValidationError(path, errorMessage);
  };

  return [value, setValue, error, setError] as const;
}