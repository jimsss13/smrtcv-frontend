import React from 'react';
import { User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserData } from '@/types/user';

interface PersonalInfoSectionProps {
  user: UserData | undefined;
}

/**
 * PersonalInfoSection Component
 * Renders a form to update the user's primary contact information.
 */
export const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
  // Accessing nested user data based on the standardized UserData interface
  const account = user?.data?.[0]?.account;
  const fullName = account?.name?.fullName || "";
  const email = account?.email || "";

  return (
    <section className="bg-white border border-gray-200 rounded-[32px] p-8 sm:p-10 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Personal Information</h3>
      </div>
      
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                defaultValue={fullName}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-sm"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                defaultValue={email}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Form Submission */}
        <div className="pt-6 border-t border-gray-100 mt-8">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black py-6 px-12 rounded-2xl text-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
};
