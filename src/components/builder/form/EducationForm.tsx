"use client";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2 } from "lucide-react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { ConfigurableField } from "./FormShared";

export function EducationForm() {
  const { education } = useClientResumeStore(useShallow((state: any) => ({
    education: state.resume.education,
  })));
  const { updateField, addSection, removeSection } = useResumeActions();
  const { config } = useDynamicForm();

  const sectionConfig = config.sections.education;
  const fields = sectionConfig?.fields;

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(education || []).map((edu: any, i: number) => (
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

          {fields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fields).map(([key, fieldConfig]) => (
                <div key={key} className={fieldConfig.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <ConfigurableField
                    config={fieldConfig}
                    value={edu[key as keyof typeof edu]}
                    onChange={(val) => updateField(`education.${i}.${key}`, val)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Fallback to default fields if no config exists */}
              <ConfigurableField
                config={{ key: "institution", label: "Institution", type: "text" }}
                value={edu.institution}
                onChange={(val) => updateField(`education.${i}.institution`, val)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigurableField
                  config={{ key: "studyType", label: "Degree", type: "text" }}
                  value={edu.studyType}
                  onChange={(val) => updateField(`education.${i}.studyType`, val)}
                />
                <ConfigurableField
                  config={{ key: "area", label: "Area of Study", type: "text" }}
                  value={edu.area}
                  onChange={(val) => updateField(`education.${i}.area`, val)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ConfigurableField
                  config={{ key: "startDate", label: "Start Date", type: "text" }}
                  value={edu.startDate}
                  onChange={(val) => updateField(`education.${i}.startDate`, val)}
                />
                <ConfigurableField
                  config={{ key: "endDate", label: "End Date", type: "text" }}
                  value={edu.endDate}
                  onChange={(val) => updateField(`education.${i}.endDate`, val)}
                />
              </div>

              <ConfigurableField
                config={{ key: "location", label: "Location", type: "text" }}
                value={edu.location}
                onChange={(val) => updateField(`education.${i}.location`, val)}
              />
              
              <ConfigurableField
                config={{ key: "score", label: "Grade / GPA", type: "text" }}
                value={edu.score}
                onChange={(val) => updateField(`education.${i}.score`, val)}
              />
            </>
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