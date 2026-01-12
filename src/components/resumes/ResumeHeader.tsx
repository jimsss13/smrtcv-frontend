import React from 'react';

export const ResumeHeader = () => {
  return (
    <section className="text-center mb-12 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight text-foreground">
        Welcome to your resume archive!
      </h1>
      <p className="text-lg sm:text-xl text-foreground font-medium opacity-90">
        Your resumes, organized in one place.
      </p>
    </section>
  );
};
