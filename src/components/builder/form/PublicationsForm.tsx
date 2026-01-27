"use client";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { PlusCircle, Trash2 } from "lucide-react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { ConfigurableField } from "./FormShared";

export function PublicationsForm() {
  const { publications } = useClientResumeStore(useShallow((state: any) => ({
    publications: state.resume.publications,
  })));
  const { updateField, addSection, removeSection } = useResumeActions();
  const { config } = useDynamicForm();

  const sectionConfig = config.sections.publications;
  const fields = sectionConfig?.fields;

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {(publications || []).map((pub: any, i: number) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 relative group">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Publication #{i + 1}</h3>
            {publications && publications.length > 1 && (
              <button 
                onClick={() => removeSection("publications", i)} 
                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
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
                    value={pub[key as keyof typeof pub]}
                    onChange={(val) => updateField(`publications.${i}.${key}`, val)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConfigurableField
                config={{ key: "name", label: "Title", type: "text" }}
                value={pub.name}
                onChange={(val) => updateField(`publications.${i}.name`, val)}
              />
              <ConfigurableField
                config={{ key: "publisher", label: "Publisher", type: "text" }}
                value={pub.publisher}
                onChange={(val) => updateField(`publications.${i}.publisher`, val)}
              />
              <ConfigurableField
                config={{ key: "releaseDate", label: "Date", type: "text" }}
                value={pub.releaseDate}
                onChange={(val) => updateField(`publications.${i}.releaseDate`, val)}
              />
              <ConfigurableField
                config={{ key: "url", label: "URL", type: "text" }}
                value={pub.url}
                onChange={(val) => updateField(`publications.${i}.url`, val)}
              />
              <div className="md:col-span-2">
                <ConfigurableField
                  config={{ key: "summary", label: "Summary", type: "textarea" }}
                  value={pub.summary}
                  onChange={(val) => updateField(`publications.${i}.summary`, val)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button 
        onClick={() => addSection("publications", { name: "", publisher: "", releaseDate: "", url: "", summary: "" })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Publication
      </button>
    </section>
  );
}