import { z } from "zod";

export const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region/State is required"),
  countryCode: z.string().min(1, "Country is required"),
});

export const profileSchema = z.object({
  network: z.string().min(1, "Network is required"),
  username: z.string().min(1, "Username is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
});

export const basicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  label: z.string().min(1, "Job title is required"),
  image: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
  url: z.string().url("Invalid URL").or(z.literal("")),
  summary: z.string().min(10, "Summary should be at least 10 characters"),
  location: locationSchema,
  profiles: z.array(profileSchema).optional(),
  nationality: z.string().optional(),
});

export const workSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  summary: z.string().min(1, "Summary is required"),
  highlights: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
  area: z.string().min(1, "Field of study is required"),
  studyType: z.string().min(1, "Degree is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  score: z.string().optional(),
  location: z.string().optional(),
});

export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  highlights: z.array(z.string()).optional(),
  url: z.string().url("Invalid URL").or(z.literal("")),
});

export const volunteerSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  summary: z.string().min(1, "Summary is required"),
  highlights: z.array(z.string()).optional(),
});

export const awardSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  date: z.string().min(1, "Date is required"),
  awarder: z.string().min(1, "Awarder is required"),
  summary: z.string().optional(),
});

export const publicationSchema = z.object({
  name: z.string().min(1, "Publication name is required"),
  publisher: z.string().min(1, "Publisher is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  url: z.string().url("Invalid URL").or(z.literal("")),
  summary: z.string().optional(),
});

export const languageSchema = z.object({
  language: z.string().min(1, "Language is required"),
  fluency: z.string().min(1, "Fluency level is required"),
});

export const interestSchema = z.object({
  name: z.string().min(1, "Interest name is required"),
  keywords: z.array(z.string()).optional(),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Reference name is required"),
  reference: z.string().min(1, "Reference details are required"),
});

export const advisorySchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
});

export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema),
  education: z.array(educationSchema),
  certificates: z.array(certificateSchema).optional(),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema).optional(),
  volunteer: z.array(volunteerSchema).optional(),
  awards: z.array(awardSchema).optional(),
  publications: z.array(publicationSchema).optional(),
  languages: z.array(languageSchema).optional(),
  interests: z.array(interestSchema).optional(),
  references: z.array(referenceSchema).optional(),
  advisory: z.array(advisorySchema).optional(),
});

export type ValidationErrors = {
  [key: string]: string;
};

export const validateField = (path: string, value: any): string | null => {
  let schema: z.ZodTypeAny;

  const parts = path.split(".");
  const section = parts[0];

  // Map path to schema
  if (section === "basics") {
    const field = parts[1];
    if (field === "location") {
      const locField = parts[2];
      schema = (locationSchema.shape as any)[locField];
    } else if (field === "profiles") {
      const profileField = parts[3];
      schema = (profileSchema.shape as any)[profileField];
    } else {
      schema = (basicsSchema.shape as any)[field];
    }
  } else if (section === "work") {
    const field = parts[2];
    schema = (workSchema.shape as any)[field];
  } else if (section === "education") {
    const field = parts[2];
    schema = (educationSchema.shape as any)[field];
  } else if (section === "skills") {
    const field = parts[2];
    schema = (skillSchema.shape as any)[field];
  } else if (section === "projects") {
    const field = parts[2];
    schema = (projectSchema.shape as any)[field];
  } else if (section === "volunteer") {
    const field = parts[2];
    schema = (volunteerSchema.shape as any)[field];
  } else if (section === "awards") {
    const field = parts[2];
    schema = (awardSchema.shape as any)[field];
  } else if (section === "publications") {
    const field = parts[2];
    schema = (publicationSchema.shape as any)[field];
  } else if (section === "languages") {
    const field = parts[2];
    schema = (languageSchema.shape as any)[field];
  } else if (section === "interests") {
    const field = parts[2];
    schema = (interestSchema.shape as any)[field];
  } else if (section === "references") {
    const field = parts[2];
    schema = (referenceSchema.shape as any)[field];
  } else if (section === "advisory") {
    const field = parts[2];
    schema = (advisorySchema.shape as any)[field];
  } else if (section === "certificates") {
    const field = parts[2];
    schema = (certificateSchema.shape as any)[field];
  } else {
    return null;
  }

  if (!schema) return null;

  const result = schema.safeParse(value);
  if (!result.success) {
    return result.error.errors[0].message;
  }

  return null;
};
