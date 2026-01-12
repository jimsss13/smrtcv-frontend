"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { PlusCircle, Trash2, Trophy, Sparkles } from "lucide-react";
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

const TextAreaGroup = ({ label, value, placeholder, onChange, error, onFixGrammar }: any) => (
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
      className={`flex min-h-[80px] w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y shadow-sm`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

function AwardEntryItem({ index, isRemovable, onRemove }: any) {
  const [title, setTitle, titleError] = useResumeField<string>(`awards.${index}.title`);
  const [awarder, setAwarder, awarderError] = useResumeField<string>(`awards.${index}.awarder`);
  const [date, setDate, dateError] = useResumeField<string>(`awards.${index}.date`);
  const [summary, setSummary, summaryError] = useResumeField<string>(`awards.${index}.summary`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-yellow-200 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Award #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <InputGroup 
        label="Award Title" 
        value={title} 
        onChange={(e: any) => setTitle(e.target.value)} 
        placeholder="e.g. Employee of the Month"
        error={titleError}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputGroup 
          label="Awarder" 
          value={awarder} 
          onChange={(e: any) => setAwarder(e.target.value)} 
          placeholder="e.g. Google" 
          error={awarderError}
        />
        <InputGroup 
          label="Date" 
          value={date} 
          onChange={(e: any) => setDate(e.target.value)} 
          placeholder="2023-12" 
          error={dateError}
        />
      </div>
      
      <TextAreaGroup 
        label="Summary" 
        value={summary} 
        onChange={(e: any) => setSummary(e.target.value)} 
        placeholder="Recognized for outstanding performance..." 
        error={summaryError}
        onFixGrammar={() => {
          const fixed = fixGrammar(summary || "");
          setSummary(fixed);
        }}
      />
    </div>
  );
}

export function AwardsForm() {
  const awards = useResumeValue((state) => state.resume.awards);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Awards & Honors</h2>
          <p className="text-xs text-gray-500">Recognitions for your achievements</p>
        </div>
      </div>

      {(awards || []).map((_, i) => (
        <AwardEntryItem 
          key={i} 
          index={i} 
          isRemovable={awards && awards.length > 1}
          onRemove={() => removeSection("awards", i)}
        />
      ))}
      <button 
        onClick={() => addSection("awards", { title: "", awarder: "", date: "", summary: "" })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Award
      </button>
    </section>
  );
}