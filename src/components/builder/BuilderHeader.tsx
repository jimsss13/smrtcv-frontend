import React from 'react';
import { Download, LayoutDashboard, Palette } from 'lucide-react';

interface BuilderHeaderProps {
  panelView: 'edit' | 'design';
  setPanelView: (view: 'edit' | 'design') => void;
  handleDownloadPdf: () => void;
}

/**
 * BuilderHeader Component
 * Renders the top navigation bar of the builder with view toggles and action buttons.
 */
export const BuilderHeader = ({ panelView, setPanelView, handleDownloadPdf }: BuilderHeaderProps) => {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
      <button 
        onClick={() => setPanelView('edit')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
          panelView === 'edit' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        Content
      </button>
      <button 
        onClick={() => setPanelView('design')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
          panelView === 'design' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <Palette className="w-4 h-4" />
        Design
      </button>
      <div className="ml-auto">
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};
