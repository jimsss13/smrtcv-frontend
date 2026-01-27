import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ResumePreviewSkeleton } from './ResumePreviewSkeleton';
import { AlertCircle, RefreshCw, FileX, Code, Terminal, FileJson, XCircle, Download, FileText, FileType } from 'lucide-react';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });
import { useResumeStore } from '@/stores/resumeStore';
import { useShallow } from 'zustand/react/shallow';
import { resumeService } from '@/services/resumeService';
import { saveAs } from 'file-saver';

interface BuilderPreviewProps {
  isClient: boolean;
  previewHtml: string | null;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * BuilderPreview Component
 * Renders the resume preview inside a scaled container. 
 * Uses an iframe for sandboxed HTML/CSS rendering.
 */
export const BuilderPreview = ({ 
  isClient, 
  previewHtml, 
  scale, 
  containerRef,
  isLoading,
  error,
  onRetry
}: BuilderPreviewProps) => {
  const [showRawJson, setShowRawJson] = React.useState(false);
  const [filterEmpty, setFilterEmpty] = React.useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const { resume, importAnalysis, setImportAnalysis, selectedTemplate, exportSettings } = useResumeStore(
    useShallow(state => ({ 
      resume: state.resume,
      importAnalysis: state.importAnalysis,
      setImportAnalysis: state.setImportAnalysis,
      selectedTemplate: state.selectedTemplate,
      exportSettings: state.exportSettings
    }))
  );

  // Helper to filter empty values from the resume object
  const getFilteredResume = (data: any): any => {
    if (data === null || data === undefined) return undefined;
    
    if (Array.isArray(data)) {
      const filtered = data.map(item => getFilteredResume(item)).filter(item => item !== undefined);
      return filtered.length > 0 ? filtered : undefined;
    }
    
    if (typeof data === 'object') {
      const filtered: Record<string, any> = {};
      let hasValue = false;
      
      for (const key in data) {
        const value = getFilteredResume(data[key]);
        if (value !== undefined) {
          filtered[key] = value;
          hasValue = true;
        }
      }
      return hasValue ? filtered : undefined;
    }
    
    if (typeof data === 'string') {
      return data.trim() !== '' ? data : undefined;
    }
    
    return data;
  };

  const displayData = React.useMemo(() => {
    if (!filterEmpty) return resume;
    return getFilteredResume(resume) || {};
  }, [resume, filterEmpty]);

  const handleExport = async (format: 'pdf' | 'docx') => {
    // If no template selected, default to 'modern' or 'classic' if possible, or alert
    const templateId = selectedTemplate || 'modern'; 
    
    setIsExporting(true);
    try {
      let blob;
      const filename = `resume.${format}`;
      if (format === 'pdf') {
        blob = await resumeService.exportPdf(resume, templateId, filename, exportSettings);
      } else {
        blob = await resumeService.exportDocx(resume, templateId, filename);
      }
      saveAs(blob, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export resume. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // 1. Analysis View (Higher priority than loading if analysis exists)
  if (importAnalysis) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{importAnalysis.fileName}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Import Analysis</p>
            </div>
          </div>
          <button 
            onClick={() => setImportAnalysis(null)}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Close Analysis"
          >
            <XCircle className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar space-y-6 bg-gray-50/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest">Detected Imports</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {importAnalysis.imports.length > 0 ? (
                importAnalysis.imports.map((imp, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-tighter">
                        {imp.type}
                      </span>
                      <code className="text-[10px] text-gray-400 font-mono">{imp.moduleSpecifier}</code>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {imp.identifiers.map((id: string, i: number) => (
                        <span key={i} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {id}
                        </span>
                      ))}
                      {imp.isFullModule && (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 italic">
                          Side Effect / Full Module
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">No import statements found in this file.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <FileJson className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest">Source Preview</h4>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl p-4 overflow-hidden shadow-inner">
              <pre className="text-[11px] font-mono text-gray-300 overflow-auto max-h-[400px] custom-scrollbar leading-relaxed">
                {importAnalysis.rawContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (!isClient || isLoading || (!previewHtml && !error)) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <ResumePreviewSkeleton />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load template</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          {error || "We encountered an issue while fetching the template resources. Please try again."}
        </p>
        <button
          onClick={() => onRetry ? onRetry() : window.location.reload()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  // 3. Empty State (No HTML and no error)
  if (!previewHtml) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <FileX className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No preview available</h3>
        <p className="text-gray-500">Your resume preview will appear here once you start editing.</p>
      </div>
    );
  }

  // 4. Success State: Render Iframe
  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>} 
      className="flex-1 bg-gray-200/50 rounded-2xl overflow-auto custom-scrollbar flex justify-center p-4 md:p-6 relative group"
    >
      {/* Floating Actions */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50"
          title="Export PDF"
        >
          {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileType className="w-5 h-5" />}
        </button>
        <button
          onClick={() => handleExport('docx')}
          disabled={isExporting}
          className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50"
          title="Export DOCX"
        >
          {isExporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
          title={showRawJson ? "Show Visual Preview" : "Show Raw Data"}
        >
          {showRawJson ? <FileX className="w-5 h-5" /> : <FileJson className="w-5 h-5" />}
        </button>
      </div>

      {showRawJson ? (
        <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FileJson className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Resume Schema Data</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Raw JSON Output</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={filterEmpty} 
                  onChange={(e) => setFilterEmpty(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                />
                Hide empty fields
              </label>
              <button 
                onClick={() => setShowRawJson(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Back to Preview
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar rounded-xl border border-white/10 bg-[#272822]">
            <div className="p-6">
              <ReactJson 
                src={displayData} 
                theme="monokai" 
                displayDataTypes={false} 
                style={{ backgroundColor: 'transparent' }} 
                name={false}
                enableClipboard={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out"
          style={{ 
            width: '794px', // A4 Width at 96 DPI
            minHeight: '1123px', // A4 Height at 96 DPI
            transform: `scale(${scale})` 
          }}
        >
          <iframe
            title="Resume Preview"
            srcDoc={previewHtml}
            className="w-full h-[1123px] border-none"
          />
        </div>
      )}
    </div>
  );
};
