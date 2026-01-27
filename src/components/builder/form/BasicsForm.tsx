"use client";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { fixGrammar } from "@/lib/ai-service";
import { InputGroup, TextAreaGroup, DynamicFields, ConfigurableField } from "./FormShared";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { Trash2 } from "lucide-react";

export function BasicsForm() {
  const { basics, updateField, validationErrors } = useClientResumeStore(useShallow((state: any) => ({
    basics: state.resume.basics,
    updateField: state.updateField,
    validationErrors: state.validationErrors
  })));

  const { config } = useDynamicForm();
  const sectionConfig = config.sections.basics;
  const fields = sectionConfig.fields;

  // If fields are explicitly defined in the template, render them dynamically
  if (fields) {
    return (
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(fields).map(([key, fieldConfig]) => {
            // Determine if the field is in basics or basics.location
            const isLocationField = ['address', 'city', 'region', 'postalCode', 'countryCode'].includes(key);
            const value = isLocationField 
              ? (basics.location?.[key] || '') 
              : (basics[key as keyof typeof basics] || '');
            
            const updatePath = isLocationField ? `basics.location.${key}` : `basics.${key}`;

            return (
              <div key={key} className={fieldConfig.type === 'textarea' || key === 'address' ? 'md:col-span-2' : ''}>
                <ConfigurableField
                  config={fieldConfig}
                  value={value}
                  onChange={(val) => updateField(updatePath as any, val)}
                  onFixGrammar={key === 'summary' ? () => {
                    const fixed = fixGrammar(basics.summary);
                    updateField("basics.summary", fixed);
                  } : undefined}
                  error={validationErrors?.[updatePath]}
                />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Fallback to default layout if no fields defined
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {/* Photo & Name Group */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-full sm:w-32 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo URL</label>
          <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group relative">
            {basics.image ? (
              <img src={basics.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-[10px] text-gray-400 text-center px-2">No Image</div>
            )}
          </div>
          <input 
            type="text" 
            value={basics.image || ""} 
            onChange={(e) => updateField("basics.image", e.target.value)}
            placeholder="https://..."
            className="w-full text-[10px] p-1 border border-gray-200 rounded mt-1 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 gap-4 w-full">
          <InputGroup
            label="Full Name"
            value={basics.name}
            onChange={(e) => updateField("basics.name", e.target.value)}
            placeholder="e.g. John Doe"
            helpText="As it appears on your ID"
            error={validationErrors?.["basics.name"]}
          />
          
          <InputGroup
            label="Job Title"
            value={basics.label}
            onChange={(e) => updateField("basics.label", e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            helpText="Your current or desired role"
            error={validationErrors?.["basics.label"]}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Email"
          value={basics.email}
          onChange={(e) => updateField("basics.email", e.target.value)}
          placeholder="john@example.com"
          helpText="Professional email preferred"
        />
        <InputGroup
          label="Phone"
          value={basics.phone}
          onChange={(e) => updateField("basics.phone", e.target.value)}
          placeholder="+1 234 567 890"
          helpText="Include country code"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Website"
          value={basics.url}
          onChange={(e) => updateField("basics.url", e.target.value)}
          placeholder="https://johndoe.com"
          helpText="Your personal website or portfolio"
        />
        <InputGroup
          label="Nationality"
          value={basics.nationality || ""}
          onChange={(e) => updateField("basics.nationality", e.target.value)}
          placeholder="e.g. American"
        />
      </div>

      {/* Social Profiles */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Social Profiles</h4>
          <button
            onClick={() => {
              const newProfiles = [...(basics.profiles || []), { network: "", username: "", url: "" }];
              updateField("basics.profiles", newProfiles);
            }}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
          >
            + Add Profile
          </button>
        </div>
        
        {(basics.profiles || []).map((profile: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-100 relative group">
            <InputGroup
              label="Network"
              value={profile.network}
              onChange={(e) => {
                const newProfiles = [...basics.profiles];
                newProfiles[idx] = { ...newProfiles[idx], network: e.target.value };
                updateField("basics.profiles", newProfiles);
              }}
              placeholder="e.g. LinkedIn"
            />
            <InputGroup
              label="Username"
              value={profile.username}
              onChange={(e) => {
                const newProfiles = [...basics.profiles];
                newProfiles[idx] = { ...newProfiles[idx], username: e.target.value };
                updateField("basics.profiles", newProfiles);
              }}
              placeholder="johndoe"
            />
            <div className="relative">
              <InputGroup
                label="URL"
                value={profile.url}
                onChange={(e) => {
                  const newProfiles = [...basics.profiles];
                  newProfiles[idx] = { ...newProfiles[idx], url: e.target.value };
                  updateField("basics.profiles", newProfiles);
                }}
                placeholder="https://..."
              />
              <button
                onClick={() => {
                  const newProfiles = basics.profiles.filter((_: any, i: number) => i !== idx);
                  updateField("basics.profiles", newProfiles);
                }}
                className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Location</h4>
        <InputGroup
          label="Address"
          value={basics.location?.address || ""}
          onChange={(e) => updateField("basics.location.address", e.target.value)}
          placeholder="123 Main St"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InputGroup
            label="City"
            value={basics.location?.city || ""}
            onChange={(e) => updateField("basics.location.city", e.target.value)}
            placeholder="New York"
          />
          <InputGroup
            label="Region"
            value={basics.location?.region || ""}
            onChange={(e) => updateField("basics.location.region", e.target.value)}
            placeholder="NY"
          />
          <InputGroup
            label="Postal Code"
            value={basics.location?.postalCode || ""}
            onChange={(e) => updateField("basics.location.postalCode", e.target.value)}
            placeholder="10001"
          />
          <InputGroup
            label="Country Code"
            value={basics.location?.countryCode || ""}
            onChange={(e) => updateField("basics.location.countryCode", e.target.value)}
            placeholder="US"
          />
        </div>
      </div>

      <TextAreaGroup
        label="Professional Summary"
        value={basics.summary}
        onChange={(e) => updateField("basics.summary", e.target.value)}
        placeholder="Briefly describe your background and key strengths..."
        onFixGrammar={() => {
          const fixed = fixGrammar(basics.summary);
          updateField("basics.summary", fixed);
        }}
      />

      <DynamicFields 
        config={sectionConfig.customFields}
        data={basics}
        onUpdate={(key, value) => updateField(`basics.${key}` as any, value)}
      />
    </section>
  );
}