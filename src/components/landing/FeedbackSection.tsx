import React from 'react';
import { Feedback } from '@/types/feedback';
import { FeedbackCarousel } from './FeedbackCarousel';

interface FeedbackSectionProps {
  feedbacks: Feedback[];
}

/**
 * FeedbackSection (Server Component)
 * Renders the wrapper for the feedback section and handles static content.
 * Delegated interactivity to FeedbackCarousel.
 */
export const FeedbackSection = ({ feedbacks }: FeedbackSectionProps) => {
  return (
    <section className="bg-background-light py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Build on feedback, trusted for careers.
        </h2>
        
        <FeedbackCarousel feedbacks={feedbacks} />
      </div>
    </section>
  );
};
