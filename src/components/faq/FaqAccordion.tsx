import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQItem[];
  searchQuery: string;
}

/**
 * FaqAccordion Component
 * Renders a list of FAQ items in an accordion format.
 * Displays a "no results" message if the filtered list is empty.
 */
export const FaqAccordion = ({ faqs, searchQuery }: FaqAccordionProps) => {
  return (
    <>
      <Accordion type="single" collapsible className="mt-8 w-full">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="mt-8 text-center text-foreground-secondary">
            No results found for "{searchQuery}"
          </p>
        )}
      </Accordion>
      
      {faqs.length > 0 && (
         <p className="mt-4 text-sm text-foreground-muted cursor-pointer hover:underline">
           ...See More
         </p>
      )}
    </>
  );
};
