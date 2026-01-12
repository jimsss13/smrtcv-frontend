import { 
  LogIn, 
  FilePlus, 
  Settings, 
  Download, 
  Sparkles, 
  Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stepsData = [
  { id: 'step1', icon: LogIn, title: 'Sign Up or Log In', description: 'Create an account in seconds to save your progress and access all features.' },
  { id: 'step2', icon: FilePlus, title: 'Create or Import', description: 'Start from scratch with a new resume or import an existing one from PDF or LinkedIn.' },
  { id: 'step3', icon: Settings, title: 'Customize Sections', description: 'Add, remove, and reorder sections like experience, education, skills, and more.' },
  { id: 'step4', icon: Download, title: 'Download & Share', description: 'Export your resume in PDF, DOCX, or TXT format and share it with a unique link.' },
  { id: 'step5', icon: Sparkles, title: 'Use AI Review', description: 'Get AI tips to review your content, fix errors, and improve formatting.' },
  { id: 'step6', icon: Eye, title: 'See Preview', description: 'As you edit, see a live preview of your final document to ensure it looks perfect.' },
];

const StepCard = ({ icon: Icon, title, description, className }: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  className?: string 
}) => (
  <div className={cn("flex flex-col items-center text-center", className)}>
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-light">
      <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
    </div>
    <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-base text-foreground-secondary">{description}</p>
  </div>
);

export const HowItWorksSection = () => {
  // Get each step individually to place them manually
  const step1 = stepsData[0];
  const step2 = stepsData[1];
  const step3 = stepsData[2];
  const step4 = stepsData[3];
  const step5 = stepsData[4];
  const step6 = stepsData[5];

  return (
    <section className="py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Build your resume in 6 easy steps!
          </h2>
        </div>
        
        {/* --- Desktop Layout--- */}
        <div className="relative mt-16 hidden lg:grid lg:grid-cols-3 lg:gap-x-8">
          

          {/* Step Cards*/}
          <StepCard {...step1} />
          <StepCard {...step2} />
          <StepCard {...step3} />
          
          <StepCard {...step6} className="mt-48" />
          <StepCard {...step5} className="mt-48" />
          <StepCard {...step4} className="mt-48" />
        </div>

        {/* --- Mobile/Tablet Layout --- */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:hidden">
          {stepsData.map((step) => (
            <StepCard key={step.id} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};