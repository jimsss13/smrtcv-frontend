import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const AddResumeSection = () => {
  return (
    <section>
      <h3 className="text-xs sm:text-base font-bold mb-3 sm:mb-4 ml-1 text-foreground">Add New</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10">
        <Link 
          href="/builder" 
          className="aspect-4/3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl sm:rounded-4xl flex flex-col items-center justify-center hover:bg-white hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
          aria-label="Create new resume"
        >
          <Plus className="w-8 h-8 sm:w-16 sm:h-16 text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
          <span className="mt-2 sm:mt-4 text-gray-500 font-bold group-hover:text-primary transition-colors text-[10px] sm:text-sm">Start Fresh</span>
        </Link>
      </div>
    </section>
  );
};
