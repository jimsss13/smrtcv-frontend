'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ResumeDB, resumeService } from '@/services/resumeService';
import { ResumeHeader } from '@/components/resumes/ResumeHeader';
import { AddResumeSection } from '@/components/resumes/AddResumeSection';
import { RecentResumesSection } from '@/components/resumes/RecentResumesSection';
import { useResumes } from '@/hooks/query/useResumes';
import { ResumeCardSkeleton } from '@/components/dashboard/ResumeCardSkeleton';

/**
 * Resume Archive Page.
 * Displays a grid of existing resumes and an option to create a new one.
 */
export default function ResumesPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useResumes();
  const [localResumes, setLocalResumes] = useState<ResumeDB[]>([]);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

  // Sync server data to local state for optimistic UI updates (deletion)
  useEffect(() => {
    if (data?.data) {
      setLocalResumes(data.data);
    }
  }, [data]);

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
  };

  const confirmDelete = async () => {
    if (resumeToDelete) {
      try {
        await resumeService.deleteResume(resumeToDelete);
        setLocalResumes(prev => prev.filter(r => r.id !== resumeToDelete));
        setResumeToDelete(null);
        refetch();
      } catch (error) {
        console.error("Failed to delete resume:", error);
        alert("Failed to delete resume. Please try again.");
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/builder?id=${id}`);
  };

  return (
    <DashboardLayout>
      {/* Greeting Section - Only show for first time users (no resumes) */}
      {!isLoading && localResumes.length === 0 && <ResumeHeader />}

      {/* Resume Sections */}
      <div className="max-w-6xl mx-auto px-4 mb-24 space-y-12">
        {/* Add New Section */}
        <AddResumeSection />

        {/* Recents Section */}
        {isLoading ? (
           <div className="space-y-4">
             <h3 className="text-xs sm:text-base font-bold mb-3 sm:mb-4 ml-1 text-foreground">Recents</h3>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
               {[1, 2, 3].map((i) => (
                 <ResumeCardSkeleton key={i} />
               ))}
             </div>
           </div>
        ) : error ? (
           <div className="flex justify-center p-12 text-red-500">
             <p>Error loading resumes. Please try again.</p>
           </div>
        ) : (
          <RecentResumesSection 
            resumes={localResumes} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit} 
          />
        )}
      </div>

       <ConfirmModal
         isOpen={resumeToDelete !== null}
         onClose={() => setResumeToDelete(null)}
         onConfirm={confirmDelete}
         title="Delete Resume"
         message="Are you sure you want to delete this resume? This action cannot be undone."
         confirmLabel="Delete"
         variant="destructive"
       />
     </DashboardLayout>
  );
}
