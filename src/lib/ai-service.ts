/**
 * AI Service for Resume Content Optimization
 * Provides suggestions, keyword optimization, and writing prompts.
 */

export const getSummarySuggestions = (jobTitle: string): string[] => {
  const suggestions: Record<string, string[]> = {
    "Frontend Developer": [
      "Passionate Frontend Developer with 5+ years of experience building responsive web applications using React and TypeScript.",
      "Detail-oriented UI/UX engineer focused on creating seamless user experiences and optimizing web performance.",
      "Creative developer with a strong foundation in modern JavaScript frameworks and a track record of delivering high-quality code."
    ],
    "Project Manager": [
      "Strategic Project Manager with a proven ability to lead cross-functional teams and deliver complex projects on time and under budget.",
      "Results-driven professional with expertise in Agile methodologies and stakeholder management.",
      "Adaptable leader focused on optimizing workflows and driving organizational growth through efficient project execution."
    ]
  };

  const defaultSuggestions = [
    "Results-driven professional with over 5 years of experience in leading teams and delivering high-impact projects.",
    "Highly motivated individual with a strong background in problem-solving and strategic thinking.",
    "Dynamic expert committed to continuous learning and excellence in the field of technology and innovation."
  ];

  return suggestions[jobTitle] || defaultSuggestions;
};

export const getKeywordOptimization = (industry: string): string[] => {
  const keywords: Record<string, string[]> = {
    "Tech": ["React", "TypeScript", "Node.js", "AWS", "CI/CD", "Docker", "GraphQL", "Agile"],
    "Finance": ["Financial Analysis", "Risk Management", "Portfolio Management", "Compliance", "SQL", "Excel VBA"],
    "Marketing": ["SEO", "Content Strategy", "Google Analytics", "CRM", "Social Media Marketing", "Brand Management"]
  };

  return keywords[industry] || ["Leadership", "Communication", "Problem Solving", "Teamwork"];
};

export const getAchievementPrompts = (): string[] => [
  "Reduced [X]% of costs by implementing [Y]",
  "Increased revenue by $[X] through [Y] strategy",
  "Managed a team of [X] members to deliver [Y] project",
  "Optimized [X] process, saving [Y] hours per week",
  "Improved user engagement by [X]% after redesigning [Y]"
];

export const getProjectSuggestions = (projectName: string): string[] => {
  const suggestions: Record<string, string[]> = {
    "E-Commerce Platform": [
      "Developed a full-stack e-commerce platform using Next.js and Stripe integration, handling 1000+ monthly transactions.",
      "Architected a scalable product catalog and shopping cart system with real-time inventory tracking.",
      "Implemented responsive design and optimized SEO, resulting in a 25% increase in organic traffic."
    ],
    "Task Management App": [
      "Built a real-time task management application with collaborative features using Socket.io and React.",
      "Implemented drag-and-drop task organization and automated email notifications for deadlines.",
      "Integrated Google Calendar API for seamless schedule synchronization."
    ]
  };

  const defaultSuggestions = [
    "Developed a high-performance web application using modern frameworks and best practices.",
    "Led the design and implementation of a scalable architecture for a complex software solution.",
    "Integrated third-party APIs and services to enhance application functionality and user experience."
  ];

  return suggestions[projectName] || defaultSuggestions;
};

export const fixGrammar = (text: string): string => {
  if (!text) return text;
  
  let fixed = text.trim();
  
  // Basic capitalization
  fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
  
  // Ensure it ends with a period if it doesn't have one
  if (!fixed.endsWith('.') && !fixed.endsWith('!') && !fixed.endsWith('?')) {
    fixed += '.';
  }
  
  // Replace some common informal words with professional ones
  const professionalMap: Record<string, string> = {
    "helped": "assisted",
    "made": "developed",
    "worked on": "collaborated on",
    "led": "spearheaded",
    "got": "obtained",
    "showed": "demonstrated",
    "fixed": "resolved",
    "did": "executed",
    "thought of": "conceived",
    "talked to": "communicated with"
  };
  
  Object.keys(professionalMap).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    fixed = fixed.replace(regex, (match) => {
      // Preserve capitalization
      if (match.charAt(0) === match.charAt(0).toUpperCase()) {
        return professionalMap[key].charAt(0).toUpperCase() + professionalMap[key].slice(1);
      }
      return professionalMap[key];
    });
  });
  
  return fixed;
};
