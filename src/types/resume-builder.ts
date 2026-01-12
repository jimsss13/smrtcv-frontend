// This is now our MASTER blueprint for ALL templates.
// We've added new optional fields for the 'Traditional' template.

export interface Resume {
  basics: Basics;
  work: Work[];
  education: Education[];
  certificates?: Certificate[];
  publications?: Publication[];
  skills: Skill[];
  awards?: Award[];
  languages: Language[];
  interests: Interest[];
  projects?: Project[];
  references?: Reference[];
  volunteer?: Volunteer[];
  advisory?: Advisory[]; // <-- NEW for Traditional
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  profiles: Profile[];
  nationality?: string; // <-- NEW for Traditional
}

export interface Location {
  address?: string; // <-- NEW for Traditional
  postalCode?: string; // <-- NEW for Traditional
  city: string;
  region: string;
  countryCode: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Work {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score?: string; // <-- NEW for Traditional
  location?: string; // <-- NEW for Traditional
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Publication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface Language {
  language: string;
  fluency: string;
}

export interface Interest {
  name: string;
  keywords: string[];
}

export interface Project {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  url: string;
}

export interface Reference {
  name: string;
  reference: string;
}

export interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

// SECTION FOR TRADITIONAL -->
export interface Advisory {
  organization: string;
  position: string;
}