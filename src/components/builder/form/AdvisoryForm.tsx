"use client";
import { useClientResumeStore, useResumeActions, ResumeState } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2 } from "lucide-react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { ConfigurableField } from "./FormShared";
import { Advisory } from "@/types/resume";

export function AdvisoryForm() {
  const { advisory } = useClientResumeStore(useShallow((state: ResumeState) => ({
    advisory: state.resume.advisory,
  })));
  const { updateField, addSection, removeSection } = useResumeActions();
  const { config } = useDynamicForm();

  const sectionConfig = config.sections.advisory;
  const fields = sectionConfig?.fields;

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(advisory || []).map((role: Advisory, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Role #{i + 1}</h3>
            {advisory && advisory.length > 1 && (
              <button 
                onClick={() => removeSection("advisory", i)} 
                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {fields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fields).map(([key, fieldConfig]) => (
                <ConfigurableField
                  key={key}
                  config={fieldConfig}
                  value={role[key as keyof typeof role]}
                  onChange={(val) => updateField(`advisory.${i}.${key}`, val)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConfigurableField
                config={{ key: "organization", label: "Organization", type: "text" }}
                value={role.organization}
                onChange={(val) => updateField(`advisory.${i}.organization`, val)}
                placeholder="e.g. Tech Board"
              />
              <ConfigurableField
                config={{ key: "position", label: "Position", type: "text" }}
                value={role.position}
                onChange={(val) => updateField(`advisory.${i}.position`, val)}
                placeholder="e.g. Board Member"
              />
              <ConfigurableField
                config={{ key: "startDate", label: "Start Date", type: "text" }}
                value={role.startDate}
                onChange={(val) => updateField(`advisory.${i}.startDate`, val)}
                placeholder="e.g. Jan 2020"
              />
              <ConfigurableField
                config={{ key: "endDate", label: "End Date", type: "text" }}
                value={role.endDate}
                onChange={(val) => updateField(`advisory.${i}.endDate`, val)}
                placeholder="e.g. Present"
              />
              <div className="md:col-span-2">
                <ConfigurableField
                  config={{ key: "summary", label: "Summary", type: "textarea" }}
                  value={role.summary}
                  onChange={(val) => updateField(`advisory.${i}.summary`, val)}
                  placeholder="Describe your role and impact..."
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button 
        onClick={() => addSection("advisory", { organization: "", position: "", startDate: "", endDate: "", summary: "" })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Advisory Role
      </button>
    </section>
  );
}