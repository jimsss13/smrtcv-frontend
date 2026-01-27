import { HeroSection } from '@/components/landing/HeroSection';
import { FeedbackSection } from '@/components/landing/FeedbackSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { feedbackData } from '@/contexts/feedback';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeedbackSection feedbacks={feedbackData} />
      <HowItWorksSection />
    </>
  );
}