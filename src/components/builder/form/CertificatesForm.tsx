"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
import { PlusCircle, Trash2, Award } from "lucide-react";
import { z } from "zod";
import { useState } from "react";

const certificateSchema = z.object({
  name: z.string().min(2, "Certificate name is required"),
  issuer: z.string().min(2, "Issuer is required"),
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

export function CertificatesForm() {
  const { certificates, updateField, addSection, removeSection } = useClientResumeStore(useCallback((state: any) => ({
    certificates: state.resume.certificates,
    updateField: state.updateField,
    addSection: state.addSection,
    removeSection: state.removeSection
  }), []), shallow);
  const [errors, setErrors] = useState<any[]>([]);

  const validate = (index: number) => {
    const cert = certificates[index];
    const result = certificateSchema.safeParse(cert);
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
        <div className="p-2 bg-purple-100 rounded-lg">
          <Award className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
          <p className="text-xs text-gray-500">Professional certifications and licenses</p>
        </div>
      </div>

      {(certificates || []).map((cert, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-purple-200 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-800">Certificate #{i + 1}</h3>
            {certificates && certificates.length > 1 && (
              <button onClick={() => removeSection("certificates", i)} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <InputGroup 
            label="Certificate Name" 
            value={cert.name} 
            onChange={(e: any) => {
              updateField(`certificates.${i}.name` as any, e.target.value);
              validate(i);
            }} 
            placeholder="e.g. AWS Solutions Architect"
            error={errors[i]?.name?.[0]}
          />
          
          <InputGroup 
            label="Issuer" 
            value={cert.issuer} 
            onChange={(e: any) => {
              updateField(`certificates.${i}.issuer` as any, e.target.value);
              validate(i);
            }} 
            placeholder="e.g. Amazon Web Services"
            error={errors[i]?.issuer?.[0]}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              label="Date" 
              value={cert.date} 
              onChange={(e: any) => updateField(`certificates.${i}.date` as any, e.target.value)} 
              placeholder="2023-05" 
            />
            <InputGroup 
              label="URL" 
              value={cert.url} 
              onChange={(e: any) => updateField(`certificates.${i}.url` as any, e.target.value)} 
              placeholder="https://..." 
            />
          </div>
        </div>
      ))}
      <button onClick={() => addSection("certificates", { name: "", issuer: "", date: "", url: "" })} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
        <PlusCircle className="w-4 h-4" /> Add Certificate
      </button>
    </section>
  );
}