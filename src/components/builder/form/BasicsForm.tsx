"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { shallow } from "zustand/shallow";
import { useCallback } from "react";
import { z } from "zod";
import { getSummarySuggestions, fixGrammar } from "@/lib/ai-service";
import { Sparkles } from "lucide-react";

interface Props {
  selectedTemplate: string;
}

// Validation Schema
const basicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
});

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
  error?: string;
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
      className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm
                 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

const TextAreaGroup = ({ 
  label, 
  value, 
  placeholder, 
  onChange, 
  className = "",
  helpText,
  onFixGrammar
}: { 
  label: string; 
  value: string; 
  placeholder?: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  className?: string;
  helpText?: string;
  onFixGrammar?: () => void;
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
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
      {helpText && (
        <span className="text-[10px] text-gray-400 font-medium italic">{helpText}</span>
      )}
    </div>
    <textarea
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 disabled:cursor-not-allowed disabled:opacity-50 resize-y shadow-sm"
    />
  </div>
);

export function BasicsForm({ selectedTemplate }: Props) {
  const { basics, updateField } = useClientResumeStore(useCallback((state: any) => ({
    basics: state.resume.basics,
    updateField: state.updateField
  }), []), shallow);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      
      {/* Photo & Name Group */}
      <div className="grid grid-cols-1 gap-4">
        <InputGroup
          label="Full Name"
          value={basics.name}
          onChange={(e) => updateField("basics.name", e.target.value)}
          placeholder="e.g. John Doe"
          helpText="As it appears on your ID"
        />
        
        <InputGroup
          label="Job Title"
          value={basics.label}
          onChange={(e) => updateField("basics.label", e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          helpText="Your current or desired role"
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <InputGroup
            label="Email"
            value={basics.email}
            onChange={(e) => updateField("basics.email", e.target.value)}
            placeholder="john@example.com"
            helpText="Professional email preferred"
          />
        </div>
        <div className="space-y-4">
          <InputGroup
            label="Phone"
            value={basics.phone}
            onChange={(e) => updateField("basics.phone", e.target.value)}
            placeholder="+1 234 567 890"
            helpText="Include country code"
          />
        </div>
      </div>

      <InputGroup
        label="Website / LinkedIn"
        value={basics.url}
        onChange={(e) => updateField("basics.url", e.target.value)}
        placeholder="https://linkedin.com/in/johndoe"
        helpText="Portfolio or LinkedIn profile"
      />

      {/* Location - Grouped logically */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Location</h3>
        
        {selectedTemplate === 'traditional' && (
          <InputGroup
            label="Address"
            value={basics.location?.address || ''}
            onChange={(e) => updateField("basics.location.address", e.target.value)}
            placeholder="123 Main St, Apt 4B"
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="City"
            value={basics.location.city}
            onChange={(e) => updateField("basics.location.city", e.target.value)}
            placeholder="New York"
          />
          <InputGroup
            label="Region / State"
            value={basics.location.region}
            onChange={(e) => updateField("basics.location.region", e.target.value)}
            placeholder="NY"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedTemplate === 'traditional' && (
            <InputGroup
              label="Postal Code"
              value={basics.location?.postalCode || ''}
              onChange={(e) => updateField("basics.location.postalCode", e.target.value)}
              placeholder="10001"
            />
          )}
          <InputGroup
            label="Country"
            value={basics.location.countryCode}
            onChange={(e) => updateField("basics.location.countryCode", e.target.value)}
            placeholder="United States"
          />
        </div>
        
        {selectedTemplate === 'traditional' && (
          <InputGroup
            label="Nationality"
            value={basics.nationality || ''}
            onChange={(e) => updateField("basics.nationality", e.target.value)}
            placeholder="American"
            helpText="Optional"
          />
        )}
      </div>

      {/* Summary Area */}
      <div className="pt-2 border-t border-gray-100">
        <TextAreaGroup
          label="Profile Summary"
          value={basics.summary}
          onChange={(e) => updateField("basics.summary", e.target.value)}
          placeholder="Briefly describe your professional background..."
          helpText="3-5 sentences recommended"
          onFixGrammar={() => {
            const fixed = fixGrammar(basics.summary);
            updateField("basics.summary", fixed);
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1">Markdown supported</p>
      </div>
    </section>
  )
}