'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { getTemplateImageUrl } from '@/lib/cdn';
import { Template } from '@/types/templates';

interface TemplatesCarouselProps {
  templates: Template[];
}

export const TemplatesCarousel = ({ templates }: TemplatesCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    emblaApi.reInit();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, templates]);

  const selectedTemplate = templates[selectedIndex];

  if (templates.length === 0) return null;

  return (
    <>
      {/* Template Info */}
      <div className="mt-12 flex flex-col items-center">
        <span className="text-xl font-semibold text-foreground">
          {selectedTemplate?.name || 'Template'}
        </span>
        <span className="mt-1 text-sm text-foreground-muted">
          45,000 users chose this template
        </span>
      </div>

      {/* --- Carousel Container --- */}
      <div className="relative mt-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="relative min-w-0 flex-shrink-0 basis-4/5 md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <div
                  className={cn(
                    'relative aspect-[3/4] w-full rounded-lg bg-background-card border border-border transition-all duration-300 ease-in-out overflow-hidden',
                    index === selectedIndex
                      ? 'scale-100 opacity-100'
                      : 'scale-90 opacity-60'
                  )}
                >
                  <div className="relative h-full w-full">
                    <img 
                      src={getTemplateImageUrl(template.thumbnail)} 
                      alt={template.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-muted', 'flex', 'items-center', 'justify-center');
                        if(e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = `<p class="text-foreground-muted">${template.name}</p>`;
                        }
                      }}
                    />
                  </div>

                  {index === selectedIndex && (
                    <Button 
                      size="default" 
                      variant="secondary" 
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow-md"
                    >
                      Use this template
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={scrollPrev}
          variant="outline"
          size="icon"
          aria-label="Previous template"
          className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-16 md:left-24 lg:left-32 z-10 rounded-full bg-background-card/50 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={scrollNext}
          variant="outline"
          size="icon"
          aria-label="Next template"
          className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-16 md:right-24 lg:left-32 z-10 rounded-full bg-background-card/50 backdrop-blur-sm"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};
