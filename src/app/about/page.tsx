import React from 'react';
import { AboutHero } from '@/components/about/AboutHero';
import { FeatureGrid } from '@/components/about/FeatureGrid';
import { MissionSection } from '@/components/about/MissionSection';
import { CenteredTextSection } from '@/components/about/CenteredTextSection';

/**
 * AboutPage Component
 * The main page for describing the mission, features, and company behind Smart CV.
 * Modularized into several sections for better readability and maintenance.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with main value proposition */}
      <AboutHero />

      {/* Intro section about company and innovation */}
      <CenteredTextSection title="Know more about us!">
        <p>
          At Smart CV, we are committed to building digital solutions that
          bridge the gap between talent and opportunity. One of our proudest
          innovations is Smart CV, a modern resume builder created to simplify and
          enhance the job application process for everyone.
        </p>
        <p>
          By making technology simple, accessible, and impactful, we designed Smart CV to
          empower both seasoned professionals and new graduates with user-friendly
          design. Our team is passionate about creating platforms like Smart CV that
          drive innovation, create opportunities, foster personal growth,
          confidence, and stronger connections.
        </p>
      </CenteredTextSection>

      {/* Mission and values section */}
      <MissionSection />

      {/* Deep dive into what makes Smart CV unique */}
      <CenteredTextSection title="Smart CV as your Smart Resume Builder">
        <p>
          Smart CV is designed to do more than just build your resume—it&apos;s for
          creating resumes that truly make an impact. With a few simple yet
          powerful features, Smart CV helps you build professional resumes in just
          minutes, not hours.
        </p>
        <p>
          By combining AI-powered suggestions, customizable templates, and real-time
          previews, Smart CV takes the stress out of resume writing and turns it
          into a smooth, simple experience. Our main goal is for all our users to
          walk away with a resume they are proud of, giving them the confidence
          to present their skills, experiences, and achievements effectively.
        </p>
        <p>
          At its core, Smart CV was built to make career opportunities more
          accessible. We believe every job seeker deserves a tool that truly
          understands their potential—and Smart CV makes that possible,
          smarter and faster.
        </p>
      </CenteredTextSection>
      
      {/* Detailed feature breakdown */}
      <FeatureGrid />
    </main>
  );
}
