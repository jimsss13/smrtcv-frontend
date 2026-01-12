'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Template } from '@/types/templates';

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
}

export const TemplateCard = memo(({ template, isActive }: TemplateCardProps) => {
  if (!isActive) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center bg-gray-50/50 rounded-4xl sm:rounded-[40px] p-6 sm:p-8 md:p-12 border-2 border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
      {/* Template Preview Card */}
      <div className="w-full lg:w-1/2 perspective-1000">
        <div className="relative aspect-3/4 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden transform transition-all duration-500 hover:rotate-y-2 hover:scale-[1.02]">
          <div className={cn("h-3 sm:h-4 w-full", template.color)} />
          <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
            <div className="h-6 sm:h-8 w-2/3 bg-gray-100 rounded" />
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-100 rounded" />
              <div className="h-2 w-full bg-gray-100 rounded" />
              <div className="h-2 w-3/4 bg-gray-100 rounded" />
            </div>
            <div className="pt-6 sm:pt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <div className="h-16 sm:h-20 bg-gray-50 rounded" />
                <div className="h-2 w-full bg-gray-50 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-16 sm:h-20 bg-gray-50 rounded" />
                <div className="h-2 w-full bg-gray-50 rounded" />
              </div>
            </div>
          </div>
          
          {template.popular && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-primary/10 text-primary px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
              Popular
            </div>
          )}
        </div>
      </div>

      {/* Template Details */}
      <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">{template.name}</h2>
          <p className="text-sm sm:text-base font-bold text-primary">{template.users}+ professionals use this</p>
        </div>
        
        <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed px-2 sm:px-0">
          {template.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button 
            asChild
            className="h-14 sm:h-16 px-8 sm:px-10 rounded-full text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
          >
            <Link href={`/builder?template=${template.id}`}>
              Use This Template
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="h-14 sm:h-16 px-8 sm:px-10 rounded-full text-base sm:text-lg font-bold border-2 hover:bg-gray-50 transition-all"
          >
            Full Preview
          </Button>
        </div>
      </div>
    </div>
  );
});
