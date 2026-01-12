import React from 'react';
import { Edit3, Eye } from 'lucide-react';

interface BuilderMobileToggleProps {
  mobileView: 'edit' | 'preview';
  setMobileView: (view: 'edit' | 'preview') => void;
}

/**
 * BuilderMobileToggle Component
 * Provides a segmented control for mobile users to switch between the editor and the preview.
 */
export const BuilderMobileToggle = ({ mobileView, setMobileView }: BuilderMobileToggleProps) => {
  return (
    <div className="md:hidden flex items-center justify-center p-2 bg-white border-b border-gray-200">
      <div className="flex bg-gray-100 p-1 rounded-lg w-full max-w-xs">
        <button 
          onClick={() => setMobileView('edit')}
          className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
            mobileView === 'edit' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button 
          onClick={() => setMobileView('preview')}
          className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
            mobileView === 'preview' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>
    </div>
  );
};
