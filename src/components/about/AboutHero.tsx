import { Button } from '@/components/ui/Button';

export const AboutHero = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Simplifying resumes to amplify your potential.
          </h1>
          <div className="mt-10">
            <Button size="lg" variant="outline">
              Learn more about Smart CV
            </Button>
          </div>
        </div>
        
        {/* Right Column: Image Placeholder */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md aspect-[4/3] rounded-lg bg-background-light border border-border flex items-center justify-center">
            <p className="text-foreground-muted">*Display Picture</p>
          </div>
        </div>
      </div>
    </section>
  );
};