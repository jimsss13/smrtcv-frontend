'use client';

import React, { useState } from 'react';
import { faqData } from '@/contexts/faq';
import { FaqSearchBar } from '@/components/faq/FaqSearchBar';
import { FaqAccordion } from '@/components/faq/FaqAccordion';

/**
 * FaqContent (Client Component)
 * Handles the interactive part of the FAQ page: search and filtered accordion.
 */
export const FaqContent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:col-span-2">
      <FaqSearchBar 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      
      <FaqAccordion 
        faqs={filteredFaqs} 
        searchQuery={searchQuery} 
      />
    </div>
  );
};
