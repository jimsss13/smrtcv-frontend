'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'; // Switched to CheckCircle to match design
import { cn } from '@/lib/utils';
import { z } from 'zod';

// --- SCHEMA & TYPES (Preserved from Original) ---
const signUpSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  email: z.string().email('Please enter a valid email address'),
});

type SignUpData = z.infer<typeof signUpSchema>;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4002';

export const SignUp = () => {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- LOGIC ---
  const validateField = (field: keyof SignUpData, value: string) => {
    try {
      signUpSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: (err as z.ZodError).issues[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof SignUpData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isStep1Valid = useMemo(() => {
    return (
      formData.firstName.length >= 2 &&
      formData.lastName.length >= 2 &&
      !errors.firstName &&
      !errors.lastName
    );
  }, [formData.firstName, formData.lastName, errors.firstName, errors.lastName]);

  const isStep2Valid = useMemo(() => {
    return formData.email.length > 0 && !errors.email;
  }, [formData.email, errors.email]);

  const handleContinue = () => {
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid) return;

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      
      // Redirect logic preserved
      setTimeout(() => {
        window.location.href = `${APP_URL}/dashboard`;
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    // Outer container: Matches target "bg-white" and centering
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      
      {/* Card container: Matches target border, shadow, and rounded-lg */}
      <div className="w-full max-w-md rounded-lg border border-gray-200 p-6 shadow-sm">
        
        {/* Dynamic Header based on state */}
        {!isSuccess && (
          <h2 className="mb-6 text-center text-2xl font-semibold">
            {step === 1 ? 'Let Us Know You!' : 'Let\'s get connected! Verify Your Email'}
          </h2>
        )}

        {isSuccess ? (
          // SUCCESS STATE: Matches target design (Centered, CheckCircle, Button)
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />
            <h3 className="mb-2 text-lg font-medium">Registration Successful!</h3>
            <p className="mb-6 text-sm text-gray-600">
              Welcome aboard, {formData.firstName}! Redirecting you to your dashboard...
            </p>
            <div className="flex justify-center">
               <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: NAMES */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    placeholder="e.g. John"
                    className={cn(
                      'w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors',
                      errors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-black'
                    )}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    placeholder="e.g. Doe"
                    className={cn(
                      'w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors',
                      errors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-black'
                    )}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <Button 
                  type="button" 
                  className="mt-4 w-full" 
                  onClick={handleContinue}
                  disabled={!isStep1Valid}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* STEP 2: EMAIL */}
            {step === 2 && (
              <div className="space-y-4">
                
                {/* Minimal summary box matching new aesthetic */}
                <div className="mb-4 flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm border border-gray-100">
                  <span className="text-gray-600">
                    {formData.firstName} {formData.lastName}
                  </span>
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="john.doe@example.com"
                    className={cn(
                      'w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors',
                      errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                   {/* Styled the Back button to fit the clean aesthetic (outline/ghost style) */}
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1 border-gray-300"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="flex-[2]" 
                    disabled={!isStep2Valid || isLoading}
                  >
                     {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Footer Link */}
        {!isSuccess && (
          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};