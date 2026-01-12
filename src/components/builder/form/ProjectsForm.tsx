"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { PlusCircle, Trash2, Sparkles, Code2 } from "lucide-react";
import { useState } from "react";
import { getProjectSuggestions, fixGrammar } from "@/lib/ai-service";

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
    <textarea 
      value={value || ""} 
      onChange={onChange} 
      placeholder={placeholder} 
      className={`flex min-h-24 w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y shadow-sm`} 
    />
    {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
  </div>
);

export function ProjectsForm() {
  const projects = useResumeValue((state) => state.resume.projects);
  const { addSection, removeSection } = useResumeActions();

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Code2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500">Showcase your best work and side projects</p>
        </div>
      </div>

      {(projects || []).map((_, i) => (
        <ProjectEntryItem 
          key={i} 
          index={i} 
          isRemovable={projects && projects.length > 1}
          onRemove={() => removeSection("projects", i)}
        />
      ))}

      <button onClick={() => addSection("projects", { name: "", description: "", url: "", startDate: "", endDate: "", highlights: [] })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Project
      </button>
    </section>
  )
}

function ProjectEntryItem({ index, isRemovable, onRemove }: any) {
  const [name, setName, nameError] = useResumeField<string>(`projects.${index}.name`);
  const [description, setDescription, descriptionError] = useResumeField<string>(`projects.${index}.description`);
  const [url, setUrl, urlError] = useResumeField<string>(`projects.${index}.url`);
  const [startDate, setStartDate, startDateError] = useResumeField<string>(`projects.${index}.startDate`);
  const [endDate, setEndDate, endDateError] = useResumeField<string>(`projects.${index}.endDate`);
  
  const [activeSuggestions, setActiveSuggestions] = useState(false);

  const handleSuggest = () => {
    if (!name) {
      alert("Please enter a project name first to get suggestions.");
      return;
    }
    setActiveSuggestions(!activeSuggestions);
  };

  const applySuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setActiveSuggestions(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Project #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <InputGroup 
        label="Project Name" 
        value={name} 
        onChange={(e: any) => setName(e.target.value)} 
        placeholder="e.g. E-Commerce Platform"
        error={nameError}
      />
      
      <InputGroup 
        label="Project URL" 
        value={url} 
        onChange={(e: any) => setUrl(e.target.value)} 
        placeholder="https://github.com/..." 
        error={urlError}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputGroup 
          label="Start Date" 
          value={startDate} 
          onChange={(e: any) => setStartDate(e.target.value)} 
          placeholder="2023-01" 
          error={startDateError}
        />
        <InputGroup 
          label="End Date" 
          value={endDate} 
          onChange={(e: any) => setEndDate(e.target.value)} 
          placeholder="2023-06" 
          error={endDateError}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
          <button 
            onClick={handleSuggest}
            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-full transition-all"
          >
            <Sparkles className="w-3 h-3" />
            AI Suggest
          </button>
        </div>

        {activeSuggestions && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] font-bold text-blue-800 uppercase">Suggested Descriptions:</p>
            {getProjectSuggestions(name || "").map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => applySuggestion(suggestion)}
                className="w-full text-left p-2 text-xs bg-white border border-blue-100 rounded hover:border-blue-400 hover:shadow-sm transition-all text-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <TextAreaGroup 
          label=""
          value={description} 
          onChange={(e: any) => setDescription(e.target.value)} 
          placeholder="Built a full-stack app using..." 
          error={descriptionError}
          onFixGrammar={() => {
            const fixed = fixGrammar(description || "");
            setDescription(fixed);
          }}
        />
      </div>
    </div>
  );
}