'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Feedback } from '@/types/feedback';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FeedbackCarouselProps {
  feedbacks: Feedback[];
}

const StarRating = ({ rating, className }: { rating: number, className?: string }) => (
  <div className={cn("flex gap-1", className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-foreground-muted'}`} 
      />
    ))}
  </div>
);

const FeedbackCard = ({ feedback }: { feedback: Feedback }) => (
  <div className="flex h-full flex-col gap-4 rounded-lg bg-background-card p-6 border border-border">
    <StarRating rating={feedback.rating} />
    <h3 className="font-semibold text-foreground">Made my job hunt easier.</h3>
    <p className="text-foreground-secondary grow">&quot;{feedback.text}&quot;</p>
    <div className="text-sm text-foreground-muted">
      &mdash; {feedback.author}, {feedback.date}
    </div>
  </div>
);

export const FeedbackCarousel = ({ feedbacks }: FeedbackCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onScroll]);

  return (
    <>
      {/* --- Mobile Layout --- */}
      <div className="md:hidden">
        <div className="mt-8 flex flex-col items-center">
          <StarRating rating={5} />
          <p className="mt-2 text-foreground-secondary">4.9 out of 5 stars Overall Rating</p>
        </div>

        {/* Carousel (Mobile) */}
        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className="relative min-w-0 shrink-0 grow-0 basis-full px-2 sm:px-4"
              >
                <FeedbackCard feedback={feedback} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls (Mobile) */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={scrollPrev} variant="outline" size="icon" aria-label="Previous feedback">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button onClick={scrollNext} variant="outline" size="icon" aria-label="Next feedback">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* --- Desktop Layout --- */}
      <div className="mt-16 hidden md:grid md:grid-cols-3 md:gap-8 lg:gap-12">
        <div className="flex flex-col justify-center text-left md:pl-8">
          <StarRating rating={5} />
          <p className="mt-4 text-3xl font-semibold text-foreground">
            4.9 out of 5 stars
          </p>
          <p className="mt-2 text-lg text-foreground-secondary">
            Overall Rating
          </p>
        </div>

        {/* Right Column: Carousel */}
        <div className="md:col-span-2">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {feedbacks.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="relative min-w-0 shrink-0 grow-0 md:basis-1/2 px-4"
                >
                  <FeedbackCard feedback={feedback} />
                </div>
              ))}
            </div>
          </div>

          {/* Controls (Desktop) */}
          <div className="mt-8 flex items-center gap-4">
            <Button onClick={scrollPrev} variant="ghost" size="icon" aria-label="Previous feedback" className="bg-background-card border border-border rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button onClick={scrollNext} variant="ghost" size="icon" aria-label="Next feedback" className="bg-background-card border border-border rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            {/* Progress Bar */}
            <div className="relative h-1 grow overflow-hidden rounded-full bg-border">
              <div 
                className="absolute left-0 top-0 h-full bg-foreground" 
                style={{ width: `${scrollProgress}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
