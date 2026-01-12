import { Briefcase, Cpu, GraduationCap, TrendingUp, Users, Zap } from 'lucide-react';

const featureData = [
  {
    icon: Briefcase,
    title: 'Professional Focus',
    description: 'Every tool and template is designed to create polished, professional resumes that stand out to employers.',
  },
  {
    icon: Cpu,
    title: 'Technology-Driven',
    description: 'Powered by AI, Smart CV offers smart suggestions, ATS-friendly templates, and content reviews.',
  },
  {
    icon: GraduationCap,
    title: 'Student-Friendly',
    description: 'Perfect for fresh graduates. Smart CV helps you build a strong resume to present your skills confidently.',
  },
  {
    icon: TrendingUp,
    title: 'Career-Growth Oriented',
    description: 'Smart CV makes resumes that grow with you, giving you the confidence to aim for your next career step.',
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'A simple, user-friendly interface means you can create a professional resume in just minutes.',
  },
  {
    icon: Zap,
    title: 'Future-Ready',
    description: 'Smart CV adapts to changing job market trends, helping you highlight your most relevant strengths.',
  },
];

export const FeatureGrid = () => {
  return (
    <section className="bg-background-light py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Learn more about Smart CV
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {featureData.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-background-card border border-border">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1 text-base text-foreground-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};