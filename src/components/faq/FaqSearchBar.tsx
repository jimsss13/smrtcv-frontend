import React from 'react';
import { Search } from 'lucide-react';

interface FaqSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * FaqSearchBar Component
 * A stylized search input for filtering FAQ items.
 */
export const FaqSearchBar = ({ value, onChange }: FaqSearchBarProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for answers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background-card p-4 pl-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
    </div>
  );
};
