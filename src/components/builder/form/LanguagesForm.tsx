"use client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";

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

function LanguageEntryItem({ index, isRemovable, onRemove }: any) {
  const [language, setLanguage, languageError] = useResumeField<string>(`languages.${index}.language`);
  const [fluency, setFluency, fluencyError] = useResumeField<string>(`languages.${index}.fluency`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Language #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup 
          label="Language" 
          value={language} 
          onChange={(e: any) => setLanguage(e.target.value)} 
          placeholder="e.g. Spanish" 
          error={languageError}
        />
        <InputGroup 
          label="Fluency" 
          value={fluency} 
          onChange={(e: any) => setFluency(e.target.value)} 
          placeholder="e.g. Native Speaker" 
          error={fluencyError}
        />
      </div>
    </div>
  );
}

export function LanguagesForm() {
  const languages = useResumeValue((state) => state.resume.languages);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(languages || []).map((_, i) => (
        <LanguageEntryItem 
          key={i} 
          index={i} 
          isRemovable={languages.length > 1}
          onRemove={() => removeSection("languages", i)}
        />
      ))}
      <button 
        onClick={() => addSection("languages", { language: "", fluency: "" })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Language
      </button>
    </section>
  )
}