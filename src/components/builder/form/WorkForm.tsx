"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { fixGrammar } from "@/lib/ai-service";
import { PlusCircle, Trash2 } from "lucide-react";
import { InputGroup, TextAreaGroup, DynamicFields, ConfigurableField } from "./FormShared";
import { useDynamicForm } from "@/hooks/useDynamicForm";

export function WorkForm() {
  const { work, updateField, addSection, removeSection } = useClientResumeStore(useShallow((state: any) => ({
    work: state.resume.work,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  })));

  const { config } = useDynamicForm();
  const sectionConfig = config.sections.work;
  const fields = sectionConfig.fields;

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(work || []).map((job: any, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Position #{i + 1}</h3>
            {work.length > 1 && (
              <button onClick={() => removeSection("work", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {fields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fields).filter(([key]) => key !== 'highlights').map(([key, fieldConfig]) => (
                <div key={key} className={fieldConfig.type === 'textarea' || key === 'name' ? 'md:col-span-2' : ''}>
                  <ConfigurableField
                    config={fieldConfig}
                    value={job[key] || ''}
                    onChange={(val) => updateField(`work.${i}.${key}` as any, val)}
                    onFixGrammar={key === 'summary' ? () => {
                      const fixed = fixGrammar(job.summary);
                      updateField(`work.${i}.summary`, fixed);
                    } : undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <InputGroup label="Company Name" value={job.name} onChange={(e: any) => updateField(`work.${i}.name`, e.target.value)} placeholder="e.g. Acme Corp" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Job Title" value={job.position} onChange={(e: any) => updateField(`work.${i}.position`, e.target.value)} placeholder="e.g. Senior Product Manager" />
                <InputGroup label="Job Location" value={job.location || ""} onChange={(e: any) => updateField(`work.${i}.location`, e.target.value)} placeholder="e.g. Remote or New York, NY" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Start Date" value={job.startDate} onChange={(e: any) => updateField(`work.${i}.startDate`, e.target.value)} placeholder="2022-03" helpText="YYYY-MM" />
                <InputGroup label="End Date" value={job.endDate} onChange={(e: any) => updateField(`work.${i}.endDate`, e.target.value)} placeholder="Present" helpText="YYYY-MM or Present" />
              </div>

              <InputGroup label="Company Website" value={job.url} onChange={(e: any) => updateField(`work.${i}.url`, e.target.value)} placeholder="https://acme.com" />
              
              <TextAreaGroup 
                label="Summary & Achievements" 
                value={job.summary} 
                onChange={(e: any) => updateField(`work.${i}.summary`, e.target.value)} 
                placeholder="Led a team of 5 developers..." 
                helpText="Highlight key accomplishments" 
                onFixGrammar={() => {
                  const fixed = fixGrammar(job.summary);
                  updateField(`work.${i}.summary`, fixed);
                }}
              />
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights</label>
            {(job.highlights || []).map((highlight: string, j: number) => (
              <div key={j} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...(job.highlights || [])];
                    newHighlights[j] = e.target.value;
                    updateField(`work.${i}.highlights` as any, newHighlights);
                  }}
                  className="flex-1 h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="e.g. Increased revenue by 20%"
                />
                <button
                  onClick={() => {
                    const newHighlights = (job.highlights || []).filter((_: string, idx: number) => idx !== j);
                    updateField(`work.${i}.highlights` as any, newHighlights);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newHighlights = [...(job.highlights || []), ""];
                updateField(`work.${i}.highlights` as any, newHighlights);
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              + Add Highlight
            </button>
          </div>

          <DynamicFields 
            config={sectionConfig.customFields ? Object.values(sectionConfig.customFields) : []}
            data={job}
            onUpdate={(key, value) => updateField(`work.${i}.${key}` as any, value)}
          />
        </div>
      ))}
      <button 
        onClick={() => addSection("work", { name: "", position: "", url: "", startDate: "", endDate: "", summary: "", location: "", highlights: [] })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Employment
      </button>
    </section>
  );
}