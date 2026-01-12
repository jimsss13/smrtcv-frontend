import { Resume } from "@/types/resume";

export interface ScoreBreakdown {
  score: number;
  maxScore: number;
  suggestions: string[];
}

/**
 * Calculates a resume score based on HR best practices.
 */
export const calculateResumeScore = (resume: Resume): ScoreBreakdown => {
  let score = 0;
  const maxScore = 100;
  const suggestions: string[] = [];

  // 1. Basics Check (20 pts)
  if (resume.basics.name) score += 5;
  else suggestions.push("Add your full name.");
  
  if (resume.basics.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.basics.email)) score += 5;
  else suggestions.push("Add a valid professional email.");
  
  if (resume.basics.summary && resume.basics.summary.length > 50) score += 10;
  else suggestions.push("Write a compelling professional summary (at least 50 characters).");

  // 2. Work Experience (30 pts)
  if (resume.work && resume.work.length > 0) {
    score += 15;
    const hasLongSummary = resume.work.some(w => w.summary && w.summary.length > 100);
    if (hasLongSummary) score += 15;
    else suggestions.push("Add more detail to your work achievements.");
  } else {
    suggestions.push("Add at least one work experience entry.");
  }

  // 3. Skills (20 pts)
  if (resume.skills && resume.skills.length >= 5) score += 20;
  else if (resume.skills && resume.skills.length > 0) {
    score += 10;
    suggestions.push("Add at least 5 key skills to improve ATS ranking.");
  } else {
    suggestions.push("List your core technical and soft skills.");
  }

  // 4. Education (15 pts)
  if (resume.education && resume.education.length > 0) score += 15;
  else suggestions.push("Add your educational background.");

  // 5. Contact/Social (15 pts)
  if (resume.basics.url) score += 15;
  else suggestions.push("Add a LinkedIn profile or portfolio URL.");

  return {
    score: Math.min(score, maxScore),
    maxScore,
    suggestions
  };
};
