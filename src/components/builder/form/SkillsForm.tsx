"use client";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2, Brain, Sparkles } from "lucide-react";
import { getKeywordOptimization } from "@/lib/ai-service";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { ConfigurableField } from "./FormShared";

export function SkillsForm() {
  const { skills } = useClientResumeStore(useShallow((state: any) => ({
    skills: state.resume.skills,
  })));
  const { updateField, updateStringArray, addSection, removeSection } = useResumeActions();
  const { config } = useDynamicForm();

  const sectionConfig = config.sections.skills;
  const fields = sectionConfig?.fields;

  const handleSuggestSkills = (index: number) => {
    const category = skills[index].name || "Tech";
    const suggested = getKeywordOptimization(category);
    const current = skills[index].keywords || [];
    const combined = Array.from(new Set([...current, ...suggested]));
    updateField(`skills.${index}.keywords`, combined);
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(skills || []).map((skill: any, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold text-gray-800">Skill Set #{i + 1}</h3>
            </div>
            {skills.length > 1 && (
              <button onClick={() => removeSection("skills", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {fields ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(fields).map(([key, fieldConfig]) => {
                  if (key === 'keywords') return null; // Handle keywords separately for AI suggestions
                  return (
                    <ConfigurableField
                      key={key}
                      config={fieldConfig}
                      value={skill[key as keyof typeof skill]}
                      onChange={(val) => updateField(`skills.${i}.${key}`, val)}
                    />
                  );
                })}
              </div>
              
              {fields.keywords && (
                <div className="space-y-2">
                  <ConfigurableField
                    config={fields.keywords}
                    value={skill.keywords?.join(', ')}
                    onChange={(val) => updateStringArray(`skills.${i}.keywords`, val)}
                  />
                  <button 
                    onClick={() => handleSuggestSkills(i)}
                    className="flex items-center gap-1 text-[10px] text-purple-600 font-bold hover:text-purple-700 transition-colors bg-purple-50 px-2 py-1 rounded"
                  >
                    <Sparkles className="w-3 h-3" />
                    Suggest Skills
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ConfigurableField
                  config={{ key: "name", label: "Category Name", type: "text" }}
                  value={skill.name}
                  onChange={(val) => updateField(`skills.${i}.name`, val)}
                />
                <ConfigurableField
                  config={{ key: "level", label: "Proficiency", type: "text" }}
                  value={skill.level}
                  onChange={(val) => updateField(`skills.${i}.level`, val)}
                />
              </div>
              <div className="space-y-2">
                <ConfigurableField
                  config={{ key: "keywords", label: "Keywords (Comma separated)", type: "text" }}
                  value={skill.keywords?.join(', ')}
                  onChange={(val) => updateStringArray(`skills.${i}.keywords`, val)}
                />
                <button 
                  onClick={() => handleSuggestSkills(i)}
                  className="flex items-center gap-1 text-[10px] text-purple-600 font-bold hover:text-purple-700 transition-colors bg-purple-50 px-2 py-1 rounded"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggest Skills
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <button onClick={() => addSection("skills", { name: "", level: "", keywords: [] })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Skill Category
      </button>
    </section>
  )
}