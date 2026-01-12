'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/query/useAuth';
import { AccountHeader } from '@/components/account/AccountHeader';
import { ProfilePhotoSection } from '@/components/account/ProfilePhotoSection';
import { NotificationsSection } from '@/components/account/NotificationsSection';
import { PersonalInfoSection } from '@/components/account/PersonalInfoSection';

/**
 * Account Settings Page.
 * Allows users to manage their personal information and profile photo.
 * Composed of several specialized sections for better maintainability.
 */
export default function AccountPage() {
  const { data: user } = useAuth();

  return (
    <DashboardLayout hideNav={true}>
      <div className="max-w-5xl mx-auto px-4 mb-24">
        {/* Page Header */}
        <AccountHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Profile Photo and Notification Settings */}
          <div className="lg:col-span-4 space-y-6">
            <ProfilePhotoSection user={user} />
            <NotificationsSection />
          </div>

          {/* Right Side: Detailed Personal Information Form */}
          <div className="lg:col-span-8">
            <PersonalInfoSection user={user} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
