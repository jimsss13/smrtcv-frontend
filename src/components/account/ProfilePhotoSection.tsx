import React from 'react';
import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserData } from '@/types/user';

interface ProfilePhotoSectionProps {
  user: UserData | undefined;
}

/**
 * ProfilePhotoSection Component
 * Displays the user's profile picture with an option to change or remove it.
 */
export const ProfilePhotoSection = ({ user }: ProfilePhotoSectionProps) => {
  // Accessing nested user data based on the standardized UserData interface
  const account = user?.data?.[0]?.account;
  const fullName = account?.name?.fullName || "User";
  const avatarUrl = account?.profilePicture?.url;

  return (
    <section className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative group mb-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          {/* Edit Photo Trigger */}
          <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-foreground truncate w-full">{fullName}</h2>
        <p className="text-xs text-gray-500 font-medium mt-1 mb-4">Profile photo for your resumes</p>
        <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-2">
          Remove Photo
        </Button>
      </div>
    </section>
  );
};
