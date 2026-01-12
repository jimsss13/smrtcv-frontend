"use client";
import { useResumeValue, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { getAchievementPrompts, getKeywordOptimization, fixGrammar } from "@/lib/ai-service";
import { PlusCircle, Trash2, Lightbulb, Sparkles } from "lucide-react";

const InputGroup = ({ label, value, placeholder, onChange, className = "", helpText, error }: any) => (
  <div className={`space-y-1.5 ${className}`}>
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

const TextAreaGroup = ({ label, value, placeholder, onChange, className = "", helpText, onFixGrammar, error }: any) => (
  <div className={`space-y-1.5 ${className}`}>
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
      {helpText && <span className="text-[10px] text-gray-400 font-medium italic">{helpText}</span>}
    </div>
    <textarea
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex min-h-[80px] w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y shadow-sm`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

export function WorkForm() {
  const work = useResumeValue((state) => state.resume.work);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(work || []).map((_, i) => (
        <WorkEntryItem 
          key={i} 
          index={i} 
          isRemovable={work.length > 1}
          onRemove={() => removeSection("work", i)}
        />
      ))}
      <button 
        onClick={() => addSection("work", { name: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [] })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Employment
      </button>
    </section>
  )
}

/**
 * Sub-component for a single work entry to isolate re-renders.
 */
function WorkEntryItem({ index, isRemovable, onRemove }: any) {
  const [name, setName, nameError] = useResumeField<string>(`work.${index}.name`);
  const [position, setPosition, positionError] = useResumeField<string>(`work.${index}.position`);
  const [url, setUrl, urlError] = useResumeField<string>(`work.${index}.url`);
  const [startDate, setStartDate, startDateError] = useResumeField<string>(`work.${index}.startDate`);
  const [endDate, setEndDate, endDateError] = useResumeField<string>(`work.${index}.endDate`);
  const [summary, setSummary, summaryError] = useResumeField<string>(`work.${index}.summary`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Position #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <InputGroup 
        label="Company Name" 
        value={name} 
        onChange={(e: any) => setName(e.target.value)} 
        placeholder="e.g. Acme Corp" 
        error={nameError}
      />
      <InputGroup 
        label="Job Title" 
        value={position} 
        onChange={(e: any) => setPosition(e.target.value)} 
        placeholder="e.g. Senior Product Manager" 
        error={positionError}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputGroup 
          label="Start Date" 
          value={startDate} 
          onChange={(e: any) => setStartDate(e.target.value)} 
          placeholder="2022-03" 
          helpText="YYYY-MM"
          error={startDateError}
        />
        <InputGroup 
          label="End Date" 
          value={endDate} 
          onChange={(e: any) => setEndDate(e.target.value)} 
          placeholder="Present" 
          helpText="YYYY-MM or Present"
          error={endDateError}
        />
      </div>

      <InputGroup 
        label="Company Website" 
        value={url} 
        onChange={(e: any) => setUrl(e.target.value)} 
        placeholder="https://acme.com" 
        error={urlError}
      />
      
      <TextAreaGroup 
        label="Summary & Achievements" 
        value={summary} 
        onChange={(e: any) => setSummary(e.target.value)} 
        placeholder="Led a team of 5 developers..." 
        helpText="Highlight key accomplishments" 
        error={summaryError}
        onFixGrammar={() => {
          const fixed = fixGrammar(summary || "");
          setSummary(fixed);
        }}
      />
    </div>
  );
}