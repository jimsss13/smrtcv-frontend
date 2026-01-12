"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { PlusCircle, Trash2, Sparkles } from "lucide-react";
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

function VolunteerEntryItem({ index, isRemovable, onRemove }: any) {
  const [organization, setOrganization, organizationError] = useResumeField<string>(`volunteer.${index}.organization`);
  const [position, setPosition, positionError] = useResumeField<string>(`volunteer.${index}.position`);
  const [startDate, setStartDate, startDateError] = useResumeField<string>(`volunteer.${index}.startDate`);
  const [endDate, setEndDate, endDateError] = useResumeField<string>(`volunteer.${index}.endDate`);
  const [summary, setSummary, summaryError] = useResumeField<string>(`volunteer.${index}.summary`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Volunteer #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <InputGroup 
        label="Organization" 
        value={organization} 
        onChange={(e: any) => setOrganization(e.target.value)} 
        placeholder="e.g. Red Cross" 
        error={organizationError}
      />
      <InputGroup 
        label="Position" 
        value={position} 
        onChange={(e: any) => setPosition(e.target.value)} 
        placeholder="e.g. Coordinator" 
        error={positionError}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputGroup 
          label="Start Date" 
          value={startDate} 
          onChange={(e: any) => setStartDate(e.target.value)} 
          placeholder="YYYY-MM" 
          error={startDateError}
        />
        <InputGroup 
          label="End Date" 
          value={endDate} 
          onChange={(e: any) => setEndDate(e.target.value)} 
          placeholder="YYYY-MM" 
          error={endDateError}
        />
      </div>
      <TextAreaGroup 
        label="Summary" 
        value={summary} 
        onChange={(e: any) => setSummary(e.target.value)} 
        placeholder="Describe your volunteer work..." 
        error={summaryError}
        onFixGrammar={() => {
          const fixed = fixGrammar(summary || "");
          setSummary(fixed);
        }}
      />
    </div>
  );
}

export function VolunteerForm() {
  const volunteer = useResumeValue((state) => state.resume.volunteer);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(volunteer || []).map((_, i) => (
        <VolunteerEntryItem 
          key={i} 
          index={i} 
          isRemovable={volunteer && volunteer.length > 1}
          onRemove={() => removeSection("volunteer", i)}
        />
      ))}
      <button 
        onClick={() => addSection("volunteer", { organization: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [] })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Volunteer
      </button>
    </section>
  )
}