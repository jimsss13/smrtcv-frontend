"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
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
  helpText,
  error
}: { 
  label: string; 
  value: string; 
  placeholder?: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  className?: string;
  helpText?: string;
  error?: string | null;
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
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

export function EducationForm({ selectedTemplate }: Props) {
  const education = useResumeValue((state) => state.resume.education);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(education || []).map((_, i) => (
        <EducationEntryItem 
          key={i} 
          index={i} 
          isRemovable={education.length > 1}
          onRemove={() => removeSection("education", i)}
          selectedTemplate={selectedTemplate}
        />
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

function EducationEntryItem({ index, isRemovable, onRemove, selectedTemplate }: any) {
  const [institution, setInstitution, institutionError] = useResumeField<string>(`education.${index}.institution`);
  const [studyType, setStudyType, studyTypeError] = useResumeField<string>(`education.${index}.studyType`);
  const [area, setArea, areaError] = useResumeField<string>(`education.${index}.area`);
  const [startDate, setStartDate, startDateError] = useResumeField<string>(`education.${index}.startDate`);
  const [endDate, setEndDate, endDateError] = useResumeField<string>(`education.${index}.endDate`);
  const [location, setLocation, locationError] = useResumeField<string>(`education.${index}.location`);
  const [score, setScore, scoreError] = useResumeField<string>(`education.${index}.score`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Education #{index + 1}</h3>
        {isRemovable && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
            title="Remove entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <InputGroup
        label="Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="e.g. University of California"
        helpText="School or University name"
        error={institutionError}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Degree"
          value={studyType}
          onChange={(e) => setStudyType(e.target.value)}
          placeholder="e.g. Bachelor of Science"
          error={studyTypeError}
        />
        <InputGroup
          label="Area of Study"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g. Computer Science"
          helpText="Major or Field"
          error={areaError}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="YYYY-MM"
          helpText="YYYY-MM"
          error={startDateError}
        />
        <InputGroup
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="YYYY-MM or Present"
          helpText="YYYY-MM or Present"
          error={endDateError}
        />
      </div>

      <InputGroup
        label="Location"
        value={location || ""}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g. San Francisco, CA"
        error={locationError}
      />
      
      {selectedTemplate === 'traditional' && (
        <InputGroup
          label="Grade / GPA"
          value={score || ""}
          onChange={(e) => setScore(e.target.value)}
          placeholder="e.g. 4.0 GPA"
          helpText="Optional"
          error={scoreError}
        />
      )}
    </div>
  );
}