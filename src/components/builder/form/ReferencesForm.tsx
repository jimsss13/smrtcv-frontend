"use client";
import { PlusCircle, Trash2, Sparkles } from "lucide-react";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
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
    <textarea value={value || ""} onChange={onChange} placeholder={placeholder} className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y shadow-sm" />
  </div>
);

export function ReferencesForm() {
  const { references, updateField, addSection, removeSection } = useClientResumeStore(useCallback((state: any) => ({
    references: state.resume.references,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  }), []), shallow);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(references || []).map((ref, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Reference #{i + 1}</h3>
            {references && references.length > 1 && (
              <button onClick={() => removeSection("references", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <InputGroup label="Name" value={ref.name} onChange={(e: any) => updateField(`references.${i}.name` as any, e.target.value)} placeholder="e.g. Jane Doe" />
          <TextAreaGroup 
            label="Contact / Details" 
            value={ref.reference} 
            onChange={(e: any) => updateField(`references.${i}.reference` as any, e.target.value)} 
            placeholder="Manager at Acme Corp - jane@acme.com" 
            onFixGrammar={() => {
              const fixed = fixGrammar(ref.reference);
              updateField(`references.${i}.reference` as any, fixed);
            }}
          />
        </div>
      ))}
      <button onClick={() => addSection("references", { name: "", reference: "" })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Reference
      </button>
    </section>
  )
}