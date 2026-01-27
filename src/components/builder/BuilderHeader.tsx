import React, { useState } from 'react';
import { Download, LayoutDashboard, Palette, FileText, ChevronDown, FileJson, FileType } from 'lucide-react';

interface BuilderHeaderProps {
  panelView: 'edit' | 'templates' | 'design';
  setPanelView: (view: 'edit' | 'templates' | 'design') => void;
  handleDownloadPdf: () => void;
  handleDownloadDocx: () => void;
}

/**
 * BuilderHeader Component
 * Renders the top navigation bar of the builder with view toggles and action buttons.
 */
export const BuilderHeader = ({ 
  panelView, 
  setPanelView, 
  handleDownloadPdf,
  handleDownloadDocx 
}: BuilderHeaderProps) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
      {/* Segmented Control Tabs */}
      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/50">
        <button 
          onClick={() => setPanelView('edit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            panelView === 'edit' 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Content
        </button>
        <button 
          onClick={() => setPanelView('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            panelView === 'templates' 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Templates
        </button>
        <button 
          onClick={() => setPanelView('design')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            panelView === 'design' 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Design
        </button>
      </div>

      {/* Action Button with Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          Export
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
        </button>

        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                handleDownloadPdf();
                setShowExportMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FileType className="w-4 h-4 text-red-500" />
              Download as PDF
            </button>
            <button
              onClick={() => {
                handleDownloadDocx();
                setShowExportMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FileJson className="w-4 h-4 text-blue-500" />
              Download as DOCX
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
