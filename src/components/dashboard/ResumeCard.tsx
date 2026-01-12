'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/Button';
import { Resume } from '@/types/dashboard-resume';

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

export const ResumeCard = memo(({ 
  resume, 
  onDelete, 
  onEdit 
}: ResumeCardProps) => {
  return (
    <article className="animate-in fade-in duration-500 relative group">
      <div className="relative aspect-4/3 bg-white border-2 border-gray-200 rounded-2xl sm:rounded-4xl shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer">
        {/* Resume Preview Placeholder */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="w-2/3 h-3/4 bg-white shadow-sm rounded-sm p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
            <div className="h-1 sm:h-2 w-1/2 bg-gray-200 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
            <div className="mt-2 sm:mt-4 h-1 sm:h-2 w-2/3 bg-gray-200 rounded" />
            <div className="h-1 sm:h-2 w-full bg-gray-100 rounded" />
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 sm:h-10 px-3 sm:px-4 rounded-full font-bold text-xs sm:text-sm min-w-24"
            onClick={(e) => {
              e.preventDefault();
              onEdit(resume.id);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-8 sm:h-10 px-3 sm:px-4 rounded-full font-bold text-xs sm:text-sm min-w-24"
            onClick={(e) => {
              e.preventDefault();
              onDelete(resume.id);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 ml-1">
        <p className="text-xs sm:text-base font-bold text-foreground truncate">{resume.name}</p>
        <p className="text-[9px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">{resume.date}</p>
      </div>
    </article>
  );
});
