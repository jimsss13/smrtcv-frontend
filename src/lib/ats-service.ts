/**
 * ATS Compatibility Checker Service
 * Analyzes resume data for common ATS (Applicant Tracking System) issues.
 */

import { Resume } from "@/types/resume";

export interface ATSAnalysisResult {
  score: number; // 0-100
  criticalIssues: string[];
  suggestions: string[];
  keywordDensity: Record<string, number>;
  formattingScore: number;
}

export const analyzeATSCompatibility = (resume: Resume): ATSAnalysisResult => {
  const criticalIssues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // 1. Contact Information Check
  if (!resume.basics.email) {
    criticalIssues.push("Missing email address");
    score -= 20;
  }
  if (!resume.basics.phone) {
    criticalIssues.push("Missing phone number");
    score -= 10;
  }
  if (!resume.basics.location?.city) {
    suggestions.push("Consider adding your city and state for local job matching");
    score -= 5;
  }

  // 2. Experience Check
  if (!resume.work || resume.work.length === 0) {
    criticalIssues.push("No work experience found");
    score -= 30;
  } else {
    resume.work.forEach((job, i) => {
      if (!job.description || job.description.length < 50) {
        suggestions.push(`Work entry #${i + 1} (${job.company}) has a very short description`);
        score -= 5;
      }
    });
  }

  // 3. Skills Check
  if (!resume.skills || resume.skills.length === 0) {
    criticalIssues.push("No skills section found");
    score -= 15;
  }

  // 4. Keyword Analysis (Basic Heuristic)
  const allText = JSON.stringify(resume).toLowerCase();
  const commonKeywords = ["project management", "leadership", "communication", "teamwork", "agile", "sdlc", "data analysis"];
  const keywordDensity: Record<string, number> = {};
  
  commonKeywords.forEach(keyword => {
    const count = (allText.match(new RegExp(keyword, "g")) || []).length;
    if (count > 0) keywordDensity[keyword] = count;
  });

  if (Object.keys(keywordDensity).length < 3) {
    suggestions.push("Low density of industry-standard keywords");
    score -= 10;
  }

  // 5. Formatting Check (Heuristic)
  let formattingScore = 100;
  if (allText.length > 5000) {
    suggestions.push("Resume may be too long for some ATS systems; aim for 1-2 pages");
    formattingScore -= 10;
  }

  return {
    score: Math.max(0, score),
    criticalIssues,
    suggestions,
    keywordDensity,
    formattingScore
  };
};
