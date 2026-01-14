"use client";

import { useCallback, useState, useEffect } from 'react';
import Image from "next/image";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { Template } from "@/types/template";
import TemplateCard from "./TemplateCard";
import { Settings, Maximize, Type, Palette as PaletteIcon, FileText } from "lucide-react";

export default function DesignPanel() {
  const { templates, selectedTemplate, exportSettings } = useClientResumeStore(
    useCallback((state) => ({ 
      templates: state.templates,
      selectedTemplate: state.selectedTemplate,
      exportSettings: state.exportSettings,
    }), [])
  );

  const { updateExportSettings, setSelectedTemplate } = useResumeActions();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto flex flex-col space-y-8 animate-in fade-in duration-500">
      {/* Template Selection */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Choose a Template</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          {templates.map((template: Template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
      </section>

      {/* Export & Formatting Settings */}
      <section className="border-t border-gray-100 pt-8 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Export Settings</h2>
        </div>

        {/* Page Size & Margins */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Maximize className="w-3 h-3" /> Page Size
            </label>
            <select 
              value={exportSettings.pageSize}
              onChange={(e) => updateExportSettings({ pageSize: e.target.value as any })}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Settings className="w-3 h-3" /> Margins
            </label>
            <select 
              value={exportSettings.margins}
              onChange={(e) => updateExportSettings({ margins: e.target.value as any })}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="narrow">Narrow</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>
        </div>

        {/* Font Size & Primary Color */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Type className="w-3 h-3" /> Font Size
            </label>
            <select 
              value={exportSettings.fontSize}
              onChange={(e) => updateExportSettings({ fontSize: e.target.value as any })}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <PaletteIcon className="w-3 h-3" /> Theme Color
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={exportSettings.primaryColor}
                onChange={(e) => updateExportSettings({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 p-1 bg-white cursor-pointer"
              />
              <span className="text-xs font-mono text-gray-500">{exportSettings.primaryColor.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}