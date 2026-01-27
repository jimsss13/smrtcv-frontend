import { Resume } from "@/types/resume";
import { FormConfig } from "@/stores/resumeStore";

export const FORM_TEMPLATES: Record<string, Partial<FormConfig>> = {
  "classic": {
    version: "1.1.0",
    sections: {
      basics: { 
        title: "Contact Information", 
        visible: true, 
        order: 0,
        fields: {
          name: { key: "name", label: "Full Name", type: "text", required: true },
          label: { key: "label", label: "Job Title", type: "text", required: true },
          email: { key: "email", label: "Email", type: "text", required: true },
          phone: { key: "phone", label: "Phone", type: "text", required: true },
          url: { key: "url", label: "LinkedIn/Website", type: "text" },
          summary: { key: "summary", label: "Professional Summary", type: "textarea", required: true },
          address: { key: "address", label: "Address", type: "text" },
          city: { key: "city", label: "City", type: "text" },
          countryCode: { key: "countryCode", label: "Country Code", type: "text" },
        }
      },
      work: { 
        title: "Work Experience", 
        visible: true, 
        order: 1,
        fields: {
          name: { key: "name", label: "Company", type: "text", required: true },
          position: { key: "position", label: "Job Title", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          startDate: { key: "startDate", label: "Start Date", type: "text", required: true },
          endDate: { key: "endDate", label: "End Date", type: "text", helpText: "Leave blank if current" },
          summary: { key: "summary", label: "Responsibilities & Achievements", type: "textarea" },
        }
      },
      education: { 
        title: "Education", 
        visible: true, 
        order: 2,
        fields: {
          institution: { key: "institution", label: "School/University", type: "text", required: true },
          studyType: { key: "studyType", label: "Degree", type: "text", required: true },
          area: { key: "area", label: "Field of Study", type: "text" },
          startDate: { key: "startDate", label: "Start Date", type: "text" },
          endDate: { key: "endDate", label: "End Date", type: "text" },
        }
      },
      skills: { 
        title: "Skills", 
        visible: true, 
        order: 3,
        fields: {
          name: { key: "name", label: "Skill Name", type: "text", required: true },
          level: { key: "level", label: "Proficiency", type: "text", placeholder: "e.g. Expert, Intermediate" },
        }
      },
      projects: { title: "Projects", visible: true, order: 4 },
      awards: { title: "Awards & Honors", visible: false, order: 5 },
      certificates: { title: "Certifications", visible: true, order: 6 },
      publications: { title: "Publications", visible: false, order: 7 },
      languages: { title: "Languages", visible: true, order: 8 },
      interests: { title: "Interests", visible: false, order: 9 },
      volunteer: { title: "Volunteer Experience", visible: false, order: 10 },
      references: { title: "References", visible: true, order: 11 },
      advisory: { title: "Advisory Roles", visible: false, order: 12 }
    }
  },
  "modern": {
    version: "1.1.0",
    sections: {
      basics: { 
        title: "Contact Information", 
        visible: true, 
        order: 0,
        fields: {
          name: { key: "name", label: "Full Name", type: "text", required: true },
          label: { key: "label", label: "Professional Label", type: "text" },
          image: { key: "image", label: "Profile Photo URL", type: "text" },
          email: { key: "email", label: "Email", type: "text", required: true },
          phone: { key: "phone", label: "Phone", type: "text" },
          url: { key: "url", label: "Portfolio/LinkedIn", type: "text" },
          summary: { key: "summary", label: "About Me", type: "textarea" },
          address: { key: "address", label: "Address", type: "text" },
          city: { key: "city", label: "Location", type: "text" },
          countryCode: { key: "countryCode", label: "Country", type: "text" },
        }
      },
      skills: { 
        title: "Skills", 
        visible: true, 
        order: 1,
        fields: {
          name: { key: "name", label: "Skill Category", type: "text", required: true },
          level: { key: "level", label: "Skill Level", type: "text" },
          keywords: { key: "keywords", label: "Specific Skills", type: "text", helpText: "Comma separated" }
        }
      },
      work: { 
        title: "Work Experience", 
        visible: true, 
        order: 2,
        fields: {
          name: { key: "name", label: "Company", type: "text", required: true },
          position: { key: "position", label: "Role", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          url: { key: "url", label: "Company URL", type: "text" },
          startDate: { key: "startDate", label: "Start", type: "text" },
          endDate: { key: "endDate", label: "End", type: "text" },
          summary: { key: "summary", label: "Impact & Results", type: "textarea" },
        }
      },
      projects: { 
        title: "Projects", 
        visible: true, 
        order: 3,
        fields: {
          name: { key: "name", label: "Project Name", type: "text", required: true },
          url: { key: "url", label: "Project Link", type: "text" },
          description: { key: "description", label: "Description", type: "textarea" },
        }
      },
      education: { title: "Education", visible: true, order: 4 },
      awards: { title: "Awards & Honors", visible: true, order: 5 },
      certificates: { title: "Certifications", visible: true, order: 6 },
      publications: { title: "Publications", visible: false, order: 7 },
      languages: { title: "Languages", visible: true, order: 8 },
      interests: { title: "Interests", visible: true, order: 9 },
      volunteer: { title: "Volunteer Experience", visible: true, order: 10 },
      references: { title: "References", visible: false, order: 11 },
      advisory: { title: "Advisory Roles", visible: false, order: 12 }
    }
  },
  "minimalist": {
    version: "1.1.0",
    sections: {
      basics: { 
        title: "Contact Information", 
        visible: true, 
        order: 0,
        fields: {
          name: { key: "name", label: "Full Name", type: "text", required: true },
          email: { key: "email", label: "Email", type: "text", required: true },
          phone: { key: "phone", label: "Phone", type: "text" },
          address: { key: "address", label: "Address", type: "text" },
          city: { key: "city", label: "City", type: "text" },
          summary: { key: "summary", label: "Brief Bio", type: "textarea" }
        }
      },
      work: { 
        title: "Work Experience", 
        visible: true, 
        order: 1,
        fields: {
          name: { key: "name", label: "Company", type: "text", required: true },
          position: { key: "position", label: "Role", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          startDate: { key: "startDate", label: "Start", type: "text" },
          endDate: { key: "endDate", label: "End", type: "text" },
        }
      },
      education: { 
        title: "Education", 
        visible: true, 
        order: 2,
        fields: {
          institution: { key: "institution", label: "School", type: "text", required: true },
          studyType: { key: "studyType", label: "Degree", type: "text", required: true },
          endDate: { key: "endDate", label: "Graduation", type: "text" },
        }
      },
      skills: { 
        title: "Skills", 
        visible: true, 
        order: 3,
        fields: {
          name: { key: "name", label: "Skill", type: "text", required: true },
        }
      },
      projects: { title: "Projects", visible: false, order: 4 },
      awards: { title: "Awards & Honors", visible: false, order: 5 },
      certificates: { title: "Certifications", visible: false, order: 6 },
      publications: { title: "Publications", visible: false, order: 7 },
      languages: { title: "Languages", visible: true, order: 8 },
      interests: { title: "Interests", visible: false, order: 9 },
      volunteer: { title: "Volunteer Experience", visible: false, order: 10 },
      references: { title: "References", visible: false, order: 11 },
      advisory: { title: "Advisory Roles", visible: false, order: 12 }
    }
  },
  "traditional": {
    version: "1.1.0",
    sections: {
      basics: { 
        title: "Contact Information", 
        visible: true, 
        order: 0,
        fields: {
          name: { key: "name", label: "Full Name", type: "text", required: true },
          label: { key: "label", label: "Title", type: "text" },
          email: { key: "email", label: "Email", type: "text", required: true },
          phone: { key: "phone", label: "Phone", type: "text" },
          url: { key: "url", label: "LinkedIn", type: "text" },
          summary: { key: "summary", label: "Professional Summary", type: "textarea" },
          address: { key: "address", label: "Address", type: "text" },
          city: { key: "city", label: "City", type: "text" },
          region: { key: "region", label: "Region/State", type: "text" },
          postalCode: { key: "postalCode", label: "Postal Code", type: "text" },
          countryCode: { key: "countryCode", label: "Country", type: "text" },
          nationality: { key: "nationality", label: "Nationality", type: "text" },
        }
      },
      work: { 
        title: "Work Experience", 
        visible: true, 
        order: 1,
        fields: {
          name: { key: "name", label: "Organization", type: "text", required: true },
          position: { key: "position", label: "Job Title", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          startDate: { key: "startDate", label: "Start Date", type: "text" },
          endDate: { key: "endDate", label: "End Date", type: "text" },
          summary: { key: "summary", label: "Responsibilities", type: "textarea" },
        }
      },
      education: { 
        title: "Education", 
        visible: true, 
        order: 2,
        fields: {
          institution: { key: "institution", label: "Institution", type: "text", required: true },
          area: { key: "area", label: "Field of Study", type: "text" },
          studyType: { key: "studyType", label: "Degree", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          startDate: { key: "startDate", label: "Start Date", type: "text" },
          endDate: { key: "endDate", label: "End Date", type: "text" },
          score: { key: "score", label: "GPA/Score", type: "text" },
        }
      },
      skills: { title: "Skills", visible: true, order: 3 },
      awards: { title: "Awards & Honors", visible: true, order: 4 },
      projects: { title: "Projects", visible: true, order: 5 },
      certificates: { title: "Certifications", visible: true, order: 6 },
      publications: { title: "Publications", visible: true, order: 7 },
      languages: { title: "Languages", visible: true, order: 8 },
      interests: { title: "Interests", visible: false, order: 9 },
      volunteer: { title: "Volunteer Experience", visible: true, order: 10 },
      references: { title: "References", visible: true, order: 11 },
      advisory: { title: "Advisory Roles", visible: true, order: 12 }
    }
  },
  "executive": {
    version: "1.1.0",
    sections: {
      basics: { 
        title: "Executive Profile", 
        visible: true, 
        order: 0,
        fields: {
          name: { key: "name", label: "Full Name", type: "text", required: true },
          label: { key: "label", label: "Executive Title", type: "text" },
          email: { key: "email", label: "Email", type: "text", required: true },
          phone: { key: "phone", label: "Direct Phone", type: "text" },
          url: { key: "url", label: "LinkedIn/Portfolio", type: "text" },
          address: { key: "address", label: "Address", type: "text" },
          city: { key: "city", label: "City", type: "text" },
          countryCode: { key: "countryCode", label: "Country", type: "text" },
          summary: { key: "summary", label: "Executive Summary", type: "textarea", placeholder: "Strategic leader with..." },
        }
      },
      work: { 
        title: "Professional Experience", 
        visible: true, 
        order: 1,
        fields: {
          name: { key: "name", label: "Company", type: "text", required: true },
          position: { key: "position", label: "Executive Role", type: "text", required: true },
          location: { key: "location", label: "Location", type: "text" },
          startDate: { key: "startDate", label: "Start Date", type: "text" },
          endDate: { key: "endDate", label: "End Date", type: "text" },
          summary: { key: "summary", label: "Strategic Achievements", type: "textarea" },
        }
      },
      advisory: { 
        title: "Advisory & Board Roles", 
        visible: true, 
        order: 2,
        fields: {
          organization: { key: "organization", label: "Organization", type: "text", required: true },
          position: { key: "position", label: "Board Position", type: "text" },
        }
      },
      education: { title: "Education", visible: true, order: 3 },
      skills: { 
        title: "Core Competencies", 
        visible: true, 
        order: 4,
        fields: {
          name: { key: "name", label: "Competency", type: "text", required: true },
        }
      },
      publications: { 
        title: "Publications & Thought Leadership", 
        visible: true, 
        order: 5,
        fields: {
          name: { key: "name", label: "Title", type: "text", required: true },
          publisher: { key: "publisher", label: "Publisher/Outlet", type: "text" },
          releaseDate: { key: "releaseDate", label: "Date", type: "text" },
          summary: { key: "summary", label: "Description", type: "textarea" },
        }
      },
      projects: { title: "Strategic Projects", visible: true, order: 6 },
      awards: { title: "Awards & Recognition", visible: true, order: 7 },
      certificates: { title: "Certifications", visible: true, order: 8 },
      languages: { title: "Languages", visible: true, order: 9 },
      interests: { title: "Interests", visible: false, order: 10 },
      volunteer: { title: "Volunteer Experience", visible: true, order: 11 },
      references: { title: "References", visible: false, order: 12 }
    }
  }
};
