"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { PlusCircle, Trash2, Brain, Sparkles } from "lucide-react";
import { getKeywordOptimization } from "@/lib/ai-service";

const InputGroup = ({ label, value, placeholder, onChange, helpText, error }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {helpText && <span className="text-[10px] text-gray-400 font-medium italic">{helpText}</span>}
    </div>
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

export function SkillsForm() {
  const skills = useResumeValue((state) => state.resume.skills);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(skills || []).map((_, i) => (
        <SkillEntryItem 
          key={i} 
          index={i} 
          isRemovable={skills.length > 1}
          onRemove={() => removeSection("skills", i)}
        />
      ))}
      <button onClick={() => addSection("skills", { name: "", level: "", keywords: [] })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Skill Category
      </button>
    </section>
  )
}

function SkillEntryItem({ index, isRemovable, onRemove }: any) {
  const [name, setName, nameError] = useResumeField<string>(`skills.${index}.name`);
  const [level, setLevel, levelError] = useResumeField<string>(`skills.${index}.level`);
  const [keywords, setKeywords, keywordsError] = useResumeField<string[]>(`skills.${index}.keywords`);
  const { updateStringArray } = useResumeActions();

  const handleSuggestSkills = () => {
    const category = name || "Tech";
    const suggested = getKeywordOptimization(category);
    const current = keywords || [];
    const combined = Array.from(new Set([...current, ...suggested]));
    setKeywords(combined);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-bold text-gray-800">Skill Set #{index + 1}</h3>
        </div>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup 
          label="Category Name" 
          value={name} 
          onChange={(e: any) => setName(e.target.value)} 
          placeholder="e.g. Frontend" 
          helpText="Group related skills" 
          error={nameError}
        />
        <InputGroup 
          label="Proficiency" 
          value={level} 
          onChange={(e: any) => setLevel(e.target.value)} 
          placeholder="e.g. Expert" 
          error={levelError}
        />
      </div>
      <div className="space-y-2">
        <InputGroup 
          label="Keywords (Comma separated)" 
          value={keywords?.join(', ')} 
          onChange={(e: any) => updateStringArray(`skills.${index}.keywords`, e.target.value)} 
          placeholder="React, TypeScript, Tailwind..." 
          helpText="Press comma to separate" 
          error={keywordsError}
        />
        <button 
          onClick={handleSuggestSkills}
          className="flex items-center gap-1 text-[10px] text-purple-600 font-bold hover:text-purple-700 transition-colors bg-purple-50 px-2 py-1 rounded"
        >
          <Sparkles className="w-3 h-3" />
          Suggest Skills
        </button>
      </div>
    </div>
  );
}