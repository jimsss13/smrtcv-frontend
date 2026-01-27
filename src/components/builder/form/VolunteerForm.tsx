"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2, Sparkles } from "lucide-react";
import { fixGrammar } from "@/lib/ai-service";

const InputGroup = ({ label, value, placeholder, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <input type="text" value={value || ""} onChange={onChange} placeholder={placeholder} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" />
  </div>
);

const TextAreaGroup = ({ label, value, placeholder, onChange, onFixGrammar }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        {onFixGrammar && (
          <button 
            onClick={onFixGrammar}
            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded transition-colors"
            title="AI Grammar Fix"
          >
            <Sparkles className="w-2.5 h-2.5" />
            Fix Grammar
          </button>
        )}
      </div>
    </div>
    <textarea 
      value={value || ""} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y shadow-sm" 
    />
  </div>
);

export function VolunteerForm() {
  const { volunteer, updateField, addSection, removeSection } = useClientResumeStore(useShallow((state: any) => ({
    volunteer: state.resume.volunteer,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  })));

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(volunteer || []).map((vol: any, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Volunteer #{i + 1}</h3>
            {volunteer && volunteer.length > 1 && (
              <button onClick={() => removeSection("volunteer", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <InputGroup label="Organization" value={vol.organization} onChange={(e: any) => updateField(`volunteer.${i}.organization` as any, e.target.value)} placeholder="e.g. Red Cross" />
          <InputGroup label="Position" value={vol.position} onChange={(e: any) => updateField(`volunteer.${i}.position` as any, e.target.value)} placeholder="e.g. Coordinator" />
          <InputGroup label="Website" value={vol.url} onChange={(e: any) => updateField(`volunteer.${i}.url` as any, e.target.value)} placeholder="https://..." />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Start Date" value={vol.startDate} onChange={(e: any) => updateField(`volunteer.${i}.startDate` as any, e.target.value)} placeholder="YYYY-MM" />
            <InputGroup label="End Date" value={vol.endDate} onChange={(e: any) => updateField(`volunteer.${i}.endDate` as any, e.target.value)} placeholder="YYYY-MM" />
          </div>
          <TextAreaGroup 
            label="Summary" 
            value={vol.summary} 
            onChange={(e: any) => updateField(`volunteer.${i}.summary` as any, e.target.value)} 
            placeholder="Describe your volunteer work..." 
            onFixGrammar={() => {
              const fixed = fixGrammar(vol.summary);
              updateField(`volunteer.${i}.summary` as any, fixed);
            }}
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights</label>
            {(vol.highlights || []).map((highlight: string, j: number) => (
              <div key={j} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...(vol.highlights || [])];
                    newHighlights[j] = e.target.value;
                    updateField(`volunteer.${i}.highlights` as any, newHighlights);
                  }}
                  className="flex-1 h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="e.g. Managed team of 10"
                />
                <button
                  onClick={() => {
                    const newHighlights = (vol.highlights || []).filter((_, idx) => idx !== j);
                    updateField(`volunteer.${i}.highlights` as any, newHighlights);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newHighlights = [...(vol.highlights || []), ""];
                updateField(`volunteer.${i}.highlights` as any, newHighlights);
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              + Add Highlight
            </button>
          </div>
        </div>
      ))}
      <button onClick={() => addSection("volunteer", { organization: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [] })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Volunteer
      </button>
    </section>
  )
}