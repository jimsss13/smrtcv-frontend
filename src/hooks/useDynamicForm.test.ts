import { renderHook, act } from '@testing-library/react';
import { useDynamicForm } from './useDynamicForm';
import { useResumeStore } from '@/stores/resumeStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the store hooks
vi.mock('@/hooks/useClientResumeStore', () => ({
  useClientResumeStore: (selector: any) => selector(useResumeStore.getState()),
  useResumeActions: () => ({
    updateFormConfig: useResumeStore.getState().updateFormConfig,
  }),
}));

describe('useDynamicForm', () => {
  beforeEach(() => {
    useResumeStore.setState({
      selectedTemplate: 'template-1',
      formConfig: {
        sections: {
          basics: { title: 'Basics', visible: true, order: 0 },
          work: { title: 'Work', visible: true, order: 1 },
        },
        version: '1.0.0',
        updatedAt: Date.now(),
      },
    });
  });

  it('should compute active sections based on visibility and order', () => {
    const { result } = renderHook(() => useDynamicForm());
    expect(result.current.activeSections).toEqual(['basics', 'work']);
  });

  it('should filter out invisible sections', () => {
    act(() => {
      useResumeStore.getState().toggleSectionVisibility('work', false);
    });
    
    const { result } = renderHook(() => useDynamicForm());
    expect(result.current.activeSections).toEqual(['basics']);
  });

  it('should reorder sections correctly', () => {
    act(() => {
      useResumeStore.getState().reorderSections(['work', 'basics']);
    });
    
    const { result } = renderHook(() => useDynamicForm());
    expect(result.current.activeSections).toEqual(['work', 'basics']);
  });

  it('should merge template overrides', () => {
    const overrides = {
      formOverrides: {
        sections: {
          basics: { title: 'Contact Info', order: 1 },
          work: { order: 0 }
        }
      }
    };

    renderHook(() => useDynamicForm(overrides));
    
    const state = useResumeStore.getState();
    expect(state.formConfig.sections.basics.title).toBe('Contact Info');
    expect(state.formConfig.sections.basics.order).toBe(1);
    expect(state.formConfig.sections.work.order).toBe(0);
  });

  it('should filter out invalid section keys', () => {
    act(() => {
      useResumeStore.setState((state: any) => {
        state.formConfig.sections.summary = { title: 'Summary', visible: true, order: 10 };
      });
    });
    
    const { result } = renderHook(() => useDynamicForm());
    expect(result.current.activeSections).not.toContain('summary');
    expect(result.current.activeSections).toEqual(['basics', 'work']);
  });
});
