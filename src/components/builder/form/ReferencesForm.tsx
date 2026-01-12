"use client";
import { PlusCircle, Trash2, Sparkles } from "lucide-react";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { fixGrammar } from "@/lib/ai-service";

const InputGroup = ({ label, value, placeholder, onChange, error }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <input 
      type="text" 
      value={value || ""} 
      onChange={onChange} 
      placeholder={placeholder} 
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} 
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

const TextAreaGroup = ({ label, value, placeholder, onChange, onFixGrammar, error }: any) => (
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
      className={`flex min-h-[80px] w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y transition-all shadow-sm`} 
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

/**
 * Sub-component for a single reference entry to isolate re-renders.
 */
function ReferenceEntryItem({ index, isRemovable, onRemove }: any) {
  const [name, setName, nameError] = useResumeField<string>(`references.${index}.name`);
  const [reference, setReference, referenceError] = useResumeField<string>(`references.${index}.reference`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Reference #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <InputGroup 
        label="Name" 
        value={name} 
        onChange={(e: any) => setName(e.target.value)} 
        placeholder="e.g. Jane Doe" 
        error={nameError}
      />
      <TextAreaGroup 
        label="Contact / Details" 
        value={reference} 
        onChange={(e: any) => setReference(e.target.value)} 
        placeholder="Manager at Acme Corp - jane@acme.com" 
        error={referenceError}
        onFixGrammar={() => {
          const fixed = fixGrammar(reference || "");
          setReference(fixed);
        }}
      />
    </div>
  );
}

export function ReferencesForm() {
  const references = useResumeValue<any[]>("references") || [];
  const { addSection, removeSection } = useResumeActions();

  const handleAdd = useCallback(() => {
    addSection("references", { name: "", reference: "" });
  }, [addSection]);

  const handleRemove = useCallback((index: number) => {
    removeSection("references", index);
  }, [removeSection]);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {references.map((_, i) => (
        <ReferenceEntryItem 
          key={i} 
          index={i} 
          isRemovable={references.length > 1}
          onRemove={() => handleRemove(i)}
        />
      ))}
      <button 
        onClick={handleAdd} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Reference
      </button>
    </section>
  );
}