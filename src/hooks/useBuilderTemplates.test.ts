import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBuilderTemplates } from '../useBuilderTemplates';
import { useClientResumeStore } from '../useClientResumeStore';

// Mock the store
vi.mock('../useClientResumeStore', () => ({
  useClientResumeStore: vi.fn(),
  useResumeActions: () => ({
    setTemplates: vi.fn(),
    setSelectedTemplate: vi.fn(),
  }),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('useBuilderTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with templates from store', () => {
    (useClientResumeStore as any).mockReturnValue({
      templates: [{ id: 't1', name: 'Template 1', html_sas_url: '...' }],
      selectedTemplate: 't1',
    });

    const { result } = renderHook(() => useBuilderTemplates());
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.selectedTemplate).toBe('t1');
  });

  it('should handle template resource fetching', async () => {
    const mockHtml = '<html><head><link rel="stylesheet" href="style.css"></head><body></body></html>';
    const mockConfig = { primaryColor: '#000' };

    (useClientResumeStore as any).mockReturnValue({
      templates: [{ 
        id: 't1', 
        name: 'Template 1', 
        html_sas_url: 'http://html',
        config_json_sas_url: 'http://config',
        css_sas_url: 'http://css'
      }],
      selectedTemplate: 't1',
    });

    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockHtml) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockConfig) });

    const { result } = renderHook(() => useBuilderTemplates());

    await waitFor(() => {
      expect(result.current.rawTemplate).toContain('window.templateConfigData');
      expect(result.current.rawTemplate).toContain('http://css');
    });
  });
});
