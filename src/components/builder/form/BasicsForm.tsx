"use client";
import { useResumeField, useResumeValue, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { getSummarySuggestions, fixGrammar } from "@/lib/ai-service";
import { Sparkles } from "lucide-react";

interface Props {
  selectedTemplate: string;
}

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
  onFixGrammar,
  error
}: { 
  label: string; 
  value: string; 
  placeholder?: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  className?: string;
  helpText?: string;
  onFixGrammar?: () => void;
  error?: string;
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
      className={`flex min-h-[120px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all shadow-sm
                 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

export function BasicsForm({ selectedTemplate }: Props) {
  const [name, setName, nameError] = useResumeField<string>("basics.name");
  const [label, setLabel, labelError] = useResumeField<string>("basics.label");
  const [email, setEmail, emailError] = useResumeField<string>("basics.email");
  const [phone, setPhone, phoneError] = useResumeField<string>("basics.phone");
  const [url, setUrl, urlError] = useResumeField<string>("basics.url");
  const [address, setAddress, addressError] = useResumeField<string>("basics.location.address");
  const [city, setCity, cityError] = useResumeField<string>("basics.location.city");
  const [region, setRegion, regionError] = useResumeField<string>("basics.location.region");
  const [postalCode, setPostalCode, postalCodeError] = useResumeField<string>("basics.location.postalCode");
  const [countryCode, setCountryCode, countryCodeError] = useResumeField<string>("basics.location.countryCode");
  const [nationality, setNationality, nationalityError] = useResumeField<string>("basics.nationality");
  const [summary, setSummary, summaryError] = useResumeField<string>("basics.summary");

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      
      {/* Photo & Name Group */}
      <div className="grid grid-cols-1 gap-4">
        <InputGroup
          label="Full Name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          helpText="As it appears on your ID"
          error={nameError}
        />
        
        <InputGroup
          label="Job Title"
          value={label || ""}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          helpText="Your current or desired role"
          error={labelError}
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <InputGroup
            label="Email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            helpText="Professional email preferred"
            error={emailError}
          />
        </div>
        <div className="space-y-4">
          <InputGroup
            label="Phone"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 890"
            helpText="Include country code"
            error={phoneError}
          />
        </div>
      </div>

      <InputGroup
        label="Website / LinkedIn"
        value={url || ""}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://linkedin.com/in/johndoe"
        helpText="Portfolio or LinkedIn profile"
        error={urlError}
      />

      {/* Location - Grouped logically */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Location</h3>
        
        {selectedTemplate === 'traditional' && (
          <InputGroup
            label="Address"
            value={address || ''}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Apt 4B"
            error={addressError}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="City"
            value={city || ""}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            error={cityError}
          />
          <InputGroup
            label="Region / State"
            value={region || ""}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="NY"
            error={regionError}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedTemplate === 'traditional' && (
            <InputGroup
              label="Postal Code"
              value={postalCode || ''}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10001"
              error={postalCodeError}
            />
          )}
          <InputGroup
            label="Country"
            value={countryCode || ""}
            onChange={(e) => setCountryCode(e.target.value)}
            placeholder="United States"
            error={countryCodeError}
          />
        </div>
        
        {selectedTemplate === 'traditional' && (
          <InputGroup
            label="Nationality"
            value={nationality || ''}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="American"
            helpText="Optional"
            error={nationalityError}
          />
        )}
      </div>

      {/* Summary Area */}
      <div className="pt-2 border-t border-gray-100">
        <TextAreaGroup
          label="Profile Summary"
          value={summary || ""}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Briefly describe your professional background..."
          helpText="3-5 sentences recommended"
          error={summaryError}
          onFixGrammar={() => {
            const fixed = fixGrammar(summary || "");
            setSummary(fixed);
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1">Markdown supported</p>
      </div>
    </section>
  )
}