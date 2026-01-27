import React from 'react';
import { ResumeDB } from '@/services/resumeService';
import { ResumeCard } from '@/components/dashboard/ResumeCard';

interface RecentResumesSectionProps {
  resumes: ResumeDB[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const RecentResumesSection = ({ resumes, onDelete, onEdit }: RecentResumesSectionProps) => {
  return (
    <section>
      <h3 className="text-xs sm:text-base font-bold mb-3 sm:mb-4 ml-1 text-foreground">Recents</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <ResumeCard 
               key={resume.id} 
               resume={resume} 
               onDelete={onDelete}
               onEdit={onEdit}
             />
           ))
         ) : (
           <div className="col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-4xl bg-gray-50/50">
             <p className="text-lg font-bold text-gray-400">No resumes found yet.</p>
             <p className="text-gray-500 mt-2 text-sm">Start by creating your first professional resume!</p>
           </div>
         )}
      </div>
    </section>
  );
};
