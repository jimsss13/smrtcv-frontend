'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TemplateHero } from '@/components/templates/TemplateHero';
import { TemplateCarousel } from '@/components/templates/TemplateCarousel';
import { useTemplates } from '@/hooks/query/useTemplates';

/**
 * Template Selection Page.
 * Showcases available resume templates in an interactive carousel.
 */
export default function TemplatesPage() {
  const { data, isLoading, error } = useTemplates();

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <TemplateHero />

      {/* Template Carousel */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center p-12 text-red-500">
          <p>Error loading templates. Please try again.</p>
        </div>
      ) : (
        <TemplateCarousel templates={data?.data || []} />
      )}
    </DashboardLayout>
  );
}
