import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Resume } from '@/types/resume';
import { Template } from '@/types/template';
import { validateField } from '@/lib/validation';

// --- 1. Type Safety Utilities ---
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends any[]
    ? `${TKey}` | `${TKey}.${number}` | `${TKey}.${number}.${RecursiveKeyOf<TObj[TKey][number]>}`
    : TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : T extends any[]
    ? PathValue<T[number], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : T extends any[]
  ? T[number]
  : never;

// --- 2. Blank "Template" Objects ---
const blankWorkEntry = {
  name: "", position: "", url: "", startDate: "", endDate: "", summary: "", location: "", highlights: []
};
const blankEducationEntry = {
  institution: "", url: "", area: "", studyType: "", startDate: "", endDate: "", score: "", location: ""
};
const blankCertificateEntry = { name: "", issuer: "", date: "", url: "" };
const blankPublicationEntry = { name: "", publisher: "", releaseDate: "", url: "", summary: "" };
const blankSkillEntry = { name: "", level: "", keywords: [] };
const blankAwardEntry = { title: "", date: "", awarder: "", summary: "" };
const blankLanguageEntry = { language: "", fluency: "" };
const blankInterestEntry = { name: "", keywords: [] };
const blankProjectEntry = { name: "", startDate: "", endDate: "", description: "", highlights: [], url: "" };
const blankReferenceEntry = { name: "", reference: "" };
const blankVolunteerEntry = { organization: "", position: "", url: "", startDate: "", endDate: "", summary: "", highlights: [] };
const blankAdvisoryEntry = { organization: "", position: "", startDate: "", endDate: "", summary: "" };

const blankResume: Resume = {
  basics: {
    name: "", label: "", image: "", email: "", phone: "", url: "", summary: "",
    location: { address: "", postalCode: "", city: "", region: "", countryCode: "" },
    profiles: [],
    nationality: "",
  },
  work: [blankWorkEntry],
  education: [blankEducationEntry],
  certificates: [blankCertificateEntry],
  publications: [blankPublicationEntry],
  skills: [blankSkillEntry],
  awards: [blankAwardEntry],
  languages: [blankLanguageEntry],
  interests: [blankInterestEntry],
  projects: [blankProjectEntry],
  references: [blankReferenceEntry],
  volunteer: [blankVolunteerEntry],
  advisory: [blankAdvisoryEntry],
};

const LOCAL_STORAGE_KEY = 'smrtcv_resume_data_v1';

const defaultSectionOrder: (keyof Resume)[] = [
  'basics',
  'work',
  'education',
  'skills',
  'projects',
  'awards',
  'certificates',
  'publications',
  'languages',
  'interests',
  'volunteer',
  'references',
  'advisory'
];

const blankEntryMap: Record<keyof Resume, unknown> = {
  basics: {},
  work: blankWorkEntry,
  education: blankEducationEntry,
  certificates: blankCertificateEntry,
  publications: blankPublicationEntry,
  skills: blankSkillEntry,
  awards: blankAwardEntry,
  languages: blankLanguageEntry,
  interests: blankInterestEntry,
  projects: blankProjectEntry,
  references: blankReferenceEntry,
  volunteer: blankVolunteerEntry,
  advisory: blankAdvisoryEntry,
};

// --- 3. Typed State & Actions ---

export interface ExportSettings {
  pageSize: 'A4' | 'Letter';
  margins: 'narrow' | 'normal' | 'wide';
  fontSize: 'small' | 'medium' | 'large';
  primaryColor: string;
}

export interface ResumeVersion {
  id: string;
  timestamp: number;
  name: string;
  resume: Resume;
}

export interface FieldConfig {
  key: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'multiselect';
  required?: boolean;
  options?: string[]; // For select/multiselect
  hidden?: boolean;
}

export interface SectionConfig {
  title: string;
  visible: boolean;
  order: number;
  fields?: Record<string, FieldConfig>;
  customFields?: Record<string, FieldConfig>;
}

export interface FormConfig {
  sections: Record<keyof Resume, SectionConfig>;
  version: string;
  updatedAt: number;
  history?: { version: string; updatedAt: number; config: FormConfig }[];
}

export interface ResumeState {
  resumeId: string | null;
  resumeTitle: string;
  resume: Resume;
  sectionOrder: (keyof Resume)[];
  exportSettings: ExportSettings;
  versions: ResumeVersion[]; 
  validationErrors?: Record<string, string>;
  templates: Template[];
  selectedTemplate: string | null;
  formConfig: FormConfig; // New: Dynamic Form Config
  importAnalysis: {
    fileName: string;
    imports: unknown[];
    rawContent: string;
  } | null;
  
  // History
  past: Resume[];
  future: Resume[];

  setResumeId: (id: string | null) => void;
  setResumeTitle: (title: string) => void;
  setResume: (resume: Resume) => void;
  undo: () => void;
  redo: () => void;
  updateField: <P extends RecursiveKeyOf<Resume>>(
    path: P,
    value: PathValue<Resume, P>
  ) => void;

  addSection: (section: keyof Resume, template: unknown) => void;
  removeSection: (section: keyof Resume, index: number) => void;
  updateStringArray: (path: RecursiveKeyOf<Resume>, value: string) => void;
  reorderSections: (newOrder: (keyof Resume)[]) => void;
  toggleSectionVisibility: (section: keyof Resume, visible: boolean) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  saveVersion: (name: string) => void; 
  restoreVersion: (id: string) => void; 
  deleteVersion: (id: string) => void; 
  setValidationError: (path: string, error: string | null) => void;
  setTemplates: (templates: Template[]) => void;
  setSelectedTemplate: (templateId: string) => void;
  updateFormConfig: (config: Partial<FormConfig>) => void; // New
  getSectionValidation: (section: keyof Resume) => { requiredFields: string[] };
  setImportAnalysis: (analysis: { fileName: string; imports: any[]; rawContent: string } | null) => void;
}

const initialFormConfig: FormConfig = {
  sections: {
    basics: { title: "Contact Information", visible: true, order: 0 },
    work: { title: "Work Experience", visible: true, order: 1 },
    education: { title: "Education", visible: true, order: 2 },
    skills: { title: "Skills", visible: true, order: 3 },
    projects: { title: "Projects", visible: true, order: 4 },
    awards: { title: "Awards & Honors", visible: true, order: 5 },
    certificates: { title: "Certifications", visible: true, order: 6 },
    publications: { title: "Publications", visible: true, order: 7 },
    languages: { title: "Languages", visible: true, order: 8 },
    interests: { title: "Interests", visible: true, order: 9 },
    volunteer: { title: "Volunteer Experience", visible: true, order: 10 },
    references: { title: "References", visible: true, order: 11 },
    advisory: { title: "Advisory Roles", visible: true, order: 12 },
  },
  version: "1.0.0",
  updatedAt: Date.now(),
};

export const useResumeStore = create(
  persist(
    immer<ResumeState>((set, get) => ({
      resumeId: null,
      resumeTitle: "Untitled Resume",
      resume: blankResume,
      sectionOrder: defaultSectionOrder,
      exportSettings: {
        pageSize: 'A4',
        margins: 'normal',
        fontSize: 'medium',
        primaryColor: '#2563eb',
      },
      versions: [], 
      validationErrors: {},
      templates: [],
      selectedTemplate: null,
      formConfig: initialFormConfig,
      importAnalysis: null,
      past: [],
      future: [],

      setResumeId: (id) => {
        set((state) => {
          state.resumeId = id;
        });
      },
      setResumeTitle: (title) => {
        set((state) => {
          state.resumeTitle = title;
        });
      },
      setResume: (resume) => {
        set((state) => {
          state.resume = resume;
        });
      },

      undo: () => {
        set((state) => {
          if (state.past.length === 0) return;
          const previous = state.past.pop();
          if (previous) {
            state.future.push(JSON.parse(JSON.stringify(state.resume)));
            state.resume = previous;
          }
        });
      },

      redo: () => {
        set((state) => {
          if (state.future.length === 0) return;
          const next = state.future.pop();
          if (next) {
            state.past.push(JSON.parse(JSON.stringify(state.resume)));
            state.resume = next;
          }
        });
      },

      setImportAnalysis: (analysis) => {
        set((state) => {
          state.importAnalysis = analysis;
        });
      },

      getSectionValidation: (section: keyof Resume) => {
        const config = get().formConfig.sections[section];
        if (!config?.fields) return { requiredFields: [] };
        
        const requiredFields = Object.entries(config.fields)
          .filter(([_, field]) => field.required)
          .map(([key]) => key);
          
        return { requiredFields };
      },

      updateFormConfig: (config) => {
        set((state) => {
          // Store current config in history before updating
          if (!state.formConfig.history) state.formConfig.history = [];
          
          const currentConfigSnapshot = {
            version: state.formConfig.version,
            updatedAt: state.formConfig.updatedAt,
            sections: JSON.parse(JSON.stringify(state.formConfig.sections))
          };

          if (config.sections) {
            state.formConfig.sections = { ...state.formConfig.sections, ...config.sections };
          }
          
          if (config.version) {
            state.formConfig.version = config.version;
          } else {
            // Auto-increment version if not provided (simple logic)
            const parts = state.formConfig.version.split('.');
            if (parts.length === 3) {
              parts[2] = (parseInt(parts[2]) + 1).toString();
              state.formConfig.version = parts.join('.');
            }
          }

          state.formConfig.updatedAt = Date.now();
          
          // Keep only last 10 versions in history
          state.formConfig.history.push(currentConfigSnapshot);
          if (state.formConfig.history.length > 10) {
            state.formConfig.history.shift();
          }
        });
      },

      setTemplates: (templates) => {
        set((state) => {
          state.templates = templates;
        });
      },

      setSelectedTemplate: (templateId) => {
        set((state) => {
          state.selectedTemplate = templateId;
        });
      },

      updateField: (path, value) => {
        set((state) => {
          // History
          state.past.push(JSON.parse(JSON.stringify(state.resume)));
          if (state.past.length > 50) state.past.shift();
          state.future = [];

          const keys = path.split(".");
          let current: Record<string, unknown> = state.resume as unknown as Record<string, unknown>;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined || current[key] === null) {
              current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
            }
            current = current[key] as Record<string, unknown>;
          }
          current[keys[keys.length - 1]] = value;

          // Validation
          const error = validateField(path, value);
          if (!state.validationErrors) state.validationErrors = {};
          if (error) {
            state.validationErrors[path] = error;
          } else {
            delete state.validationErrors[path];
          }
        });
      },

      addSection: (section, template) => {
        set((state) => {
          state.past.push(JSON.parse(JSON.stringify(state.resume)));
          if (state.past.length > 50) state.past.shift();
          state.future = [];

          const sectionArray = state.resume[section] as unknown[] | undefined;
          if (Array.isArray(sectionArray)) {
            (sectionArray as unknown[]).push(template);
          } else {
            (state.resume[section] as unknown) = [template];
          }
        });
      },

      // --- NEW: Remove Implementation ---
      removeSection: (section, index) => {
        set((state) => {
          state.past.push(JSON.parse(JSON.stringify(state.resume)));
          if (state.past.length > 50) state.past.shift();
          state.future = [];

          const sectionArray = state.resume[section] as unknown[] | undefined;
          if (Array.isArray(sectionArray)) {
            sectionArray.splice(index, 1);
          }
        });
      },

      updateStringArray: (path, value) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        set((state) => {
          state.past.push(JSON.parse(JSON.stringify(state.resume)));
          if (state.past.length > 50) state.past.shift();
          state.future = [];

          const keys = path.split(".");
          let current = state.resume as any;
          for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = arr;
        });
      },

      reorderSections: (newOrder) => {
        set((state) => {
          state.sectionOrder = newOrder;
          // Sync with formConfig
          newOrder.forEach((key, index) => {
            if (state.formConfig.sections[key]) {
              state.formConfig.sections[key].order = index;
            }
          });
          state.formConfig.updatedAt = Date.now();
        });
      },

      toggleSectionVisibility: (section, visible) => {
        set((state) => {
          if (state.formConfig.sections[section]) {
            state.formConfig.sections[section].visible = visible;
            state.formConfig.updatedAt = Date.now();
          }
        });
      },

      updateExportSettings: (settings) => {
        set((state) => {
          state.exportSettings = { ...state.exportSettings, ...settings };
        });
      },

      saveVersion: (name) => {
        set((state) => {
          state.versions.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            name,
            resume: JSON.parse(JSON.stringify(state.resume)),
          });
        });
      },

      restoreVersion: (id) => {
        set((state) => {
          const version = state.versions.find((v) => v.id === id);
          if (version) {
            state.resume = JSON.parse(JSON.stringify(version.resume));
          }
        });
      },

      deleteVersion: (id) => {
        set((state) => {
          state.versions = state.versions.filter((v) => v.id !== id);
        });
      },

      setValidationError: (path, error) => {
        set((state) => {
          if (!state.validationErrors) state.validationErrors = {};
          if (error) {
            state.validationErrors[path] = error;
          } else {
            delete state.validationErrors[path];
          }
        });
      },
    })),
    {
      name: LOCAL_STORAGE_KEY,
      // Exclude templates from persistence so they are always fetched fresh from Azure
      partialize: (state) => {
        const { templates, ...rest } = state;
        return rest;
      },
      merge: (persistedState, currentState) => {
        const pState = persistedState as ResumeState;
        const mergedState = {
          ...currentState,
          ...pState,
          // Explicitly ensure templates are NOT restored from local storage
          templates: currentState.templates,
          resume: {
            ...currentState.resume,
            ...(pState?.resume || {}),
          },
          sectionOrder: pState?.sectionOrder || currentState.sectionOrder,
        };

        const mergedResume = mergedState.resume;

        Object.keys(blankEntryMap).forEach((key) => {
          const resumeKey = key as keyof Resume;
          if (resumeKey === 'basics') return;

          const sectionArray = mergedResume[resumeKey] as any[] | undefined;
          if (!sectionArray || sectionArray.length === 0) {
            (mergedResume[resumeKey] as any) = [blankEntryMap[resumeKey]];
          }
        });
        
        return mergedState;
      }
    }
  )
);