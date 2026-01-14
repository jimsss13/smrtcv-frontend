"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

interface Props {
  selectedTemplate?: string;
}

// Reusable Input Component (Consistent with BasicsForm)
const InputGroup = ({ 
  label, 
  value, 
  placeholder, 
  onChange, 
  className = "",
  helpText
}: { 
  label: string; 
  value: string; 
  placeholder?: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  className?: string;
  helpText?: string;
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {helpText && (
        <span className="text-[10px] text-gray-400 font-medium italic">{helpText}</span>
      )}
    </div>
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
    />
  </div>
);

export function EducationForm({ selectedTemplate }: Props) {
  const { education, updateField, addSection, removeSection } = useClientResumeStore(useCallback((state: any) => ({
    education: state.resume.education,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  }), []), shallow);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(education || []).map((edu, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
          
          {/* Header with Delete Button */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Education #{i + 1}</h3>
            
            {/* Only show delete if there is more than 1 item */}
            {education.length > 1 && (
              <button
                onClick={() => removeSection("education", i)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                title="Remove entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <InputGroup
            label="Institution"
            value={edu.institution}
            onChange={(e) => updateField(`education.${i}.institution`, e.target.value)}
            placeholder="e.g. University of California"
            helpText="School or University name"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Degree"
              value={edu.studyType}
              onChange={(e) => updateField(`education.${i}.studyType`, e.target.value)}
              placeholder="e.g. Bachelor of Science"
            />
            <InputGroup
              label="Area of Study"
              value={edu.area}
              onChange={(e) => updateField(`education.${i}.area`, e.target.value)}
              placeholder="e.g. Computer Science"
              helpText="Major or Field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Start Date"
              value={edu.startDate}
              onChange={(e) => updateField(`education.${i}.startDate`, e.target.value)}
              placeholder="YYYY-MM"
              helpText="YYYY-MM"
            />
            <InputGroup
              label="End Date"
              value={edu.endDate}
              onChange={(e) => updateField(`education.${i}.endDate`, e.target.value)}
              placeholder="YYYY-MM or Present"
              helpText="YYYY-MM or Present"
            />
          </div>

          <InputGroup
            label="Location"
            value={edu.location || ""}
            onChange={(e) => updateField(`education.${i}.location`, e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
          
          {selectedTemplate === 'traditional' && (
            <InputGroup
              label="Grade / GPA"
              value={edu.score || ""}
              onChange={(e) => updateField(`education.${i}.score`, e.target.value)}
              placeholder="e.g. 4.0 GPA"
              helpText="Optional"
            />
          )}
        </div>
      ))}

      <button 
        type="button" 
        onClick={() => addSection("education", { 
          institution: "", 
          url: "", 
          area: "", 
          studyType: "", 
          startDate: "", 
          endDate: "", 
          location: "", 
          score: "" 
        })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> 
        Add Education
      </button>
    </section>
  )
}