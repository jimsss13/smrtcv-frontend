import React from 'react';

/**
 * AccountHeader Component
 * Renders the top title and description for the account settings page.
 */
export const AccountHeader = () => {
  return (
    <header className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
        Account Settings
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 font-medium mt-2">
        Manage your personal information and preferences.
      </p>
    </header>
  );
};
