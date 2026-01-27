import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex justify-center items-center py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Smart CV. <br className="hidden sm:block" />
              Your smart resume builder.
            </h1>
            <p className="mt-4 md:mt-6 text-base sm:text-lg text-foreground-secondary max-w-xl mx-auto md:mx-0">
              Start fresh or bring in your existing resume.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/builder">Create New Resume</Link>
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/builder?import=true">Import Resume</Link>
              </Button>
            </div>
          </div>
          
          {/* Sample CV Display */}
          <div className="flex items-center justify-center order-1 md:order-2">
            <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] rounded-2xl bg-background-light border border-border shadow-inner overflow-hidden">
              <Image 
                src="/sample-landing.png" 
                alt="Sample Landing Preview" 
                fill
                className="object-cover"
                suppressHydrationWarning
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};