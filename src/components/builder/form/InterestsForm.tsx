"use client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";

const InputGroup = ({ label, value, placeholder, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <input type="text" value={value || ""} onChange={onChange} placeholder={placeholder} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" />
  </div>
);

export function InterestsForm() {
  const { interests, updateField, updateStringArray, addSection, removeSection } = useClientResumeStore(useCallback((state: any) => ({
    interests: state.resume.interests,
    updateField: state.updateField,
    updateStringArray: state.updateStringArray,
    addSection: state.addSection,
    removeSection: state.removeSection
  }), []), shallow);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(interests || []).map((interest, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Interest Group #{i + 1}</h3>
            {interests.length > 1 && (
              <button onClick={() => removeSection("interests", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <InputGroup label="Category" value={interest.name} onChange={(e: any) => updateField(`interests.${i}.name`, e.target.value)} placeholder="e.g. Hobbies" />
          <InputGroup label="Keywords (Comma separated)" value={interest.keywords?.join(', ')} onChange={(e: any) => updateStringArray(`interests.${i}.keywords`, e.target.value)} placeholder="Hiking, Chess, Photography" />
        </div>
      ))}
      <button onClick={() => addSection("interests", { name: "", keywords: [] })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Interest
      </button>
    </section>
  )
}