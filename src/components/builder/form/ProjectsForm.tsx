"use client";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2, Code2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { ConfigurableField } from "./FormShared";
import { getProjectSuggestions, fixGrammar } from "@/lib/ai-service";

export function ProjectsForm() {
  const { projects } = useClientResumeStore(useShallow((state: any) => ({
    projects: state.resume.projects,
  })));
  const { updateField, addSection, removeSection } = useResumeActions();
  const { config } = useDynamicForm();
  const [activeSuggestions, setActiveSuggestions] = useState<number | null>(null);

  const sectionConfig = config.sections.projects;
  const fields = sectionConfig?.fields;

  const handleSuggest = (index: number) => {
    const projectName = projects[index].name;
    if (!projectName) {
      alert("Please enter a project name first to get suggestions.");
      return;
    }
    setActiveSuggestions(activeSuggestions === index ? null : index);
  };

  const applySuggestion = (index: number, suggestion: string) => {
    updateField(`projects.${index}.description` as any, suggestion);
    setActiveSuggestions(null);
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Code2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500">Showcase your best work and side projects</p>
        </div>
      </div>

      {(projects || []).map((project: any, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Project #{i + 1}</h3>
            {projects.length > 1 && (
              <button 
                onClick={() => removeSection("projects", i)} 
                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {fields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fields).map(([key, fieldConfig]) => {
                const isTextArea = fieldConfig.type === 'textarea';
                const isDescription = key === 'description';

                return (
                  <div key={key} className={isTextArea ? 'md:col-span-2 space-y-2' : ''}>
                    {isDescription && (
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                        <button 
                          onClick={() => handleSuggest(i)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-full transition-all"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Suggest
                        </button>
                      </div>
                    )}

                    {isDescription && activeSuggestions === i && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2 mb-3 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-bold text-blue-800 uppercase">Suggested Descriptions:</p>
                        {getProjectSuggestions(project.name).map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => applySuggestion(i, suggestion)}
                            className="w-full text-left p-2 text-xs bg-white border border-blue-100 rounded hover:border-blue-400 hover:shadow-sm transition-all text-gray-700"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <ConfigurableField
                      config={fieldConfig}
                      value={project[key as keyof typeof project]}
                      onChange={(val) => updateField(`projects.${i}.${key}`, val)}
                      onFixGrammar={isDescription ? () => {
                        const fixed = fixGrammar(project.description);
                        updateField(`projects.${i}.description` as any, fixed);
                      } : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConfigurableField
                config={{ key: "name", label: "Project Name", type: "text" }}
                value={project.name}
                onChange={(val) => updateField(`projects.${i}.name`, val)}
              />
              <ConfigurableField
                config={{ key: "url", label: "Project URL", type: "text" }}
                value={project.url}
                onChange={(val) => updateField(`projects.${i}.url`, val)}
              />
              <ConfigurableField
                config={{ key: "startDate", label: "Start Date", type: "text" }}
                value={project.startDate}
                onChange={(val) => updateField(`projects.${i}.startDate`, val)}
              />
              <ConfigurableField
                config={{ key: "endDate", label: "End Date", type: "text" }}
                value={project.endDate}
                onChange={(val) => updateField(`projects.${i}.endDate`, val)}
              />
              <div className="md:col-span-2">
                <ConfigurableField
                  config={{ key: "description", label: "Description", type: "textarea" }}
                  value={project.description}
                  onChange={(val) => updateField(`projects.${i}.description`, val)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights</label>
                {(project.highlights || []).map((highlight: string, j: number) => (
                  <div key={j} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...(project.highlights || [])];
                        newHighlights[j] = e.target.value;
                        updateField(`projects.${i}.highlights` as any, newHighlights);
                      }}
                      className="flex-1 h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="e.g. Optimized performance by 40%"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = (project.highlights || []).filter((_, idx) => idx !== j);
                        updateField(`projects.${i}.highlights` as any, newHighlights);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...(project.highlights || []), ""];
                    updateField(`projects.${i}.highlights` as any, newHighlights);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  + Add Highlight
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button 
        onClick={() => addSection("projects", { name: "", description: "", url: "", startDate: "", endDate: "", highlights: [] })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Project
      </button>
    </section>
  );
}