"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
import { PlusCircle, Trash2, Trophy, Sparkles } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { fixGrammar } from "@/lib/ai-service";

const awardSchema = z.object({
  title: z.string().min(2, "Award title is required"),
  awarder: z.string().min(2, "Awarder is required"),
});

const InputGroup = ({ label, value, placeholder, onChange, error }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <input 
      type="text" 
      value={value || ""} 
      onChange={onChange} 
      placeholder={placeholder} 
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-200'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm`} 
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
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

export function AwardsForm() {
  const { awards, updateField, addSection, removeSection } = useClientResumeStore(useCallback((state: any) => ({
    awards: state.resume.awards,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  }), []), shallow);
  const [errors, setErrors] = useState<any[]>([]);

  const validate = (index: number) => {
    const award = awards[index];
    const result = awardSchema.safeParse(award);
    const newErrors = [...errors];
    if (!result.success) {
      newErrors[index] = result.error.flatten().fieldErrors;
    } else {
      delete newErrors[index];
    }
    setErrors(newErrors);
  };

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

      {(awards || []).map((award, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-yellow-200 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Award #{i + 1}</h3>
            {awards && awards.length > 1 && (
              <button onClick={() => removeSection("awards", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <InputGroup 
            label="Award Title" 
            value={award.title} 
            onChange={(e: any) => {
              updateField(`awards.${i}.title` as any, e.target.value);
              validate(i);
            }} 
            placeholder="e.g. Employee of the Month"
            error={errors[i]?.title?.[0]}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              label="Awarder" 
              value={award.awarder} 
              onChange={(e: any) => {
                updateField(`awards.${i}.awarder` as any, e.target.value);
                validate(i);
              }} 
              placeholder="e.g. Google" 
              error={errors[i]?.awarder?.[0]}
            />
            <InputGroup 
              label="Date" 
              value={award.date} 
              onChange={(e: any) => updateField(`awards.${i}.date` as any, e.target.value)} 
              placeholder="2023-12" 
            />
          </div>
          
          <TextAreaGroup 
            label="Summary" 
            value={award.summary} 
            onChange={(e: any) => updateField(`awards.${i}.summary` as any, e.target.value)} 
            placeholder="Recognized for outstanding performance..." 
            onFixGrammar={() => {
              const fixed = fixGrammar(award.summary);
              updateField(`awards.${i}.summary` as any, fixed);
            }}
          />
        </div>
      ))}
      <button onClick={() => addSection("awards", { title: "", awarder: "", date: "", summary: "" })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Award
      </button>
    </section>
  );
}