"use client";

import React from "react";
import { Sparkles } from "lucide-react";

import { FieldConfig } from "@/stores/resumeStore";

export const ConfigurableField = ({
  config,
  value,
  onChange,
  onFixGrammar,
  error
}: {
  config: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  onFixGrammar?: () => void;
  error?: string;
}) => {
  if (config.hidden) return null;

  switch (config.type) {
    case 'textarea':
      return (
        <TextAreaGroup
          id={config.key}
          label={config.label || config.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          helpText={config.helpText}
          onFixGrammar={onFixGrammar}
          required={config.required}
          error={error}
        />
      );
    case 'select':
      return (
        <div className="space-y-1.5">
          <label 
            htmlFor={config.key}
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            {config.label || config.key}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            id={config.key}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
          >
            <option value="">Select...</option>
            {config.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
        </div>
      );
    default:
      return (
        <InputGroup
          id={config.key}
          label={config.label || config.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          helpText={config.helpText}
          error={error}
          required={config.required}
        />
      );
  }
};

interface InputGroupProps {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
}

export const InputGroup = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  className = "",
  helpText,
  error,
  required,
}: InputGroupProps) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="flex justify-between items-center">
      <label 
        htmlFor={id}
        className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helpText && (
        <span className="text-[10px] text-gray-400 font-medium italic">{helpText}</span>
      )}
    </div>
    <input
      id={id}
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

interface TextAreaGroupProps {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  helpText?: string;
  onFixGrammar?: () => void;
  required?: boolean;
  error?: string;
}

export const TextAreaGroup = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  className = "",
  helpText,
  onFixGrammar,
  required,
  error,
}: TextAreaGroupProps) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <label 
          htmlFor={id}
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
      id={id}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex min-h-[120px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                 disabled:cursor-not-allowed disabled:opacity-50 resize-y shadow-sm
                 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
    />
    {error && <p className="text-[10px] text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

export const DynamicFields = ({ 
  config, 
  data, 
  onUpdate 
}: { 
  config?: any[]; 
  data: any; 
  onUpdate: (key: string, value: any) => void 
}) => {
  if (!config || config.length === 0) return null;

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Fields</h3>
      <div className="grid grid-cols-1 gap-4">
        {config.map((field) => (
          field.type === 'textarea' ? (
            <TextAreaGroup
              key={field.key}
              label={field.label}
              value={data[field.key] || ''}
              onChange={(e) => onUpdate(field.key, e.target.value)}
              placeholder={field.placeholder}
              helpText={field.helpText}
            />
          ) : (
            <InputGroup
              key={field.key}
              label={field.label}
              value={data[field.key] || ''}
              onChange={(e) => onUpdate(field.key, e.target.value)}
              placeholder={field.placeholder}
              helpText={field.helpText}
            />
          )
        ))}
      </div>
    </div>
  );
};
