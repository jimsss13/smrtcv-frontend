"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useBuilderTemplates } from "@/hooks/useBuilderTemplates";
import TemplateCard from "@/components/builder/TemplateCard";
import { useRouter } from "next/navigation";
import { useResumeActions } from "@/hooks/useClientResumeStore";
import { LayoutTemplate, Sparkles, Plus } from "lucide-react";

/**
 * TemplatesView Component
 * Provides the UI and logic for browsing and selecting templates from the dashboard.
 * Separated from the app router to keep the app folder clean.
 */
export const TemplatesView = () => {
  const { templates, isLoading, error } = useBuilderTemplates();
  const { setSelectedTemplate } = useResumeActions();
  const router = useRouter();

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    router.push("/builder");
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <LayoutTemplate className="w-8 h-8 text-blue-600" />
              Templates Library
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Choose from our collection of ATS-ready professional templates.
            </p>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
            <div className="p-1.5 bg-blue-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Expert Pick</p>
              <p className="text-xs font-bold text-blue-900 leading-none">ATS-Optimized Designs</p>
            </div>
          </div>
        </header>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[210/297] bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                <div className="h-6 bg-gray-50 animate-pulse rounded-lg w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-10 rounded-3xl border border-red-100 text-center space-y-3">
            <p className="text-red-600 font-black text-xl">Oops! Something went wrong.</p>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {templates.map((template) => (
              <div key={template.id} className="group relative flex flex-col">
                <TemplateCard
                  template={template}
                  isSelected={false}
                  onSelect={handleSelectTemplate}
                />
                
                {/* Hover Action Overlay - Centered and more professional */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <button
                    onClick={() => handleSelectTemplate(template.id)}
                    className="pointer-events-auto bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black shadow-2xl shadow-blue-500/40 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-700 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
