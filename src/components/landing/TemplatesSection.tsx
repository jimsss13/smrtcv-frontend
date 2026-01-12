import React from 'react';
import { TemplatesCarousel } from './TemplatesCarousel';
import { Template } from '@/types/templates';

async function getTemplates(): Promise<Template[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/templates`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

/**
 * TemplatesSection (Server Component)
 * Fetches template data on the server and renders the section wrapper.
 * Interactivity is handled by the TemplatesCarousel client component.
 */
export const TemplatesSection = async () => {
  const templates = await getTemplates();

  if (templates.length === 0) return null;

  return (
    <section className="bg-background-light py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        {/* Main Headings */}
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Stand out with templates that work!
        </h2>
        <p className="mt-4 text-base text-foreground-secondary">
          Start fresh or choose a battle-tested resume.
        </p>

        <TemplatesCarousel templates={templates} />
      </div>
    </section>
  );
};
