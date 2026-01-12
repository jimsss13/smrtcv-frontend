"use client";

import React, { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Properties for the FormInput component.
 */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The human-readable label for the input field. */
  label: string;
  /** Optional icon to display on the left side of the input. */
  icon?: LucideIcon;
  /** Optional error message to display below the input. */
  error?: string;
}

/**
 * A standardized form input component with a label, optional icon, and error message.
 * Optimized for use within the resume builder forms.
 * 
 * @example
 * <FormInput 
 *   label="Full Name" 
 *   icon={UserIcon} 
 *   placeholder="John Doe" 
 *   error={errors.fullName}
 * />
 * 
 * @param props - Component properties including label, icon, and standard HTML input attributes.
 * @param ref - React ref for the underlying input element.
 */
const FormInput = memo(React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            ref={ref}
            className={cn(
              "w-full pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-sm",
              Icon ? "pl-12" : "pl-4",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
));

FormInput.displayName = "FormInput";

export { FormInput };
export default FormInput;
