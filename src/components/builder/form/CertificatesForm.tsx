"use client";
import { useResumeValue, useResumeActions, useResumeField } from "@/hooks/useClientResumeStore";
import { PlusCircle, Trash2, Award } from "lucide-react";

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

function CertificateEntryItem({ index, isRemovable, onRemove }: any) {
  const [name, setName, nameError] = useResumeField<string>(`certificates.${index}.name`);
  const [issuer, setIssuer, issuerError] = useResumeField<string>(`certificates.${index}.issuer`);
  const [date, setDate, dateError] = useResumeField<string>(`certificates.${index}.date`);
  const [url, setUrl, urlError] = useResumeField<string>(`certificates.${index}.url`);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-purple-200 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-800">Certificate #{index + 1}</h3>
        {isRemovable && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <InputGroup 
        label="Certificate Name" 
        value={name} 
        onChange={(e: any) => setName(e.target.value)} 
        placeholder="e.g. AWS Solutions Architect"
        error={nameError}
      />
      
      <InputGroup 
        label="Issuer" 
        value={issuer} 
        onChange={(e: any) => setIssuer(e.target.value)} 
        placeholder="e.g. Amazon Web Services"
        error={issuerError}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputGroup 
          label="Date" 
          value={date} 
          onChange={(e: any) => setDate(e.target.value)} 
          placeholder="2023-05" 
          error={dateError}
        />
        <InputGroup 
          label="URL" 
          value={url} 
          onChange={(e: any) => setUrl(e.target.value)} 
          placeholder="https://..." 
          error={urlError}
        />
      </div>
    </div>
  );
}

export function CertificatesForm() {
  const certificates = useResumeValue((state) => state.resume.certificates);
  const { addSection, removeSection } = useResumeActions();

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

      {(certificates || []).map((_, i) => (
        <CertificateEntryItem 
          key={i} 
          index={i} 
          isRemovable={certificates && certificates.length > 1}
          onRemove={() => removeSection("certificates", i)}
        />
      ))}
      <button 
        onClick={() => addSection("certificates", { name: "", issuer: "", date: "", url: "" })} 
        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" /> Add Certificate
      </button>
    </section>
  );
}