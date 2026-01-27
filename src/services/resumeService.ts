import { Resume } from "@/types/resume";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL 
  ? `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1`
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");

export interface ImportResponse {
  success: boolean;
  message?: string;
  data?: Resume;
}

export interface ResumeDB {
  id: string;
  title: string;
  data: Resume;
  created_at: string;
  updated_at: string;
}

export const resumeService = {
  async listResumes(): Promise<ResumeDB[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resume`);
      if (!response.ok) throw new Error("Failed to list resumes");
      return await response.json();
    } catch (error) {
      console.error("Error listing resumes:", error);
      return [];
    }
  },

  async createResume(title: string, data: Resume): Promise<ResumeDB> {
    const response = await fetch(`${API_BASE_URL}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data }),
    });
    if (!response.ok) throw new Error("Failed to create resume");
    return await response.json();
  },

  async getResume(id: string): Promise<ResumeDB> {
    const response = await fetch(`${API_BASE_URL}/resume/${id}`);
    if (!response.ok) throw new Error("Failed to get resume");
    return await response.json();
  },

  async updateResume(id: string, title: string, data: Resume): Promise<ResumeDB> {
    const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data }),
    });
    if (!response.ok) throw new Error("Failed to update resume");
    return await response.json();
  },

  async deleteResume(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete resume");
  },

  async importResume(file: File): Promise<ImportResponse> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to import resume");
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error importing resume:", message);
      return {
        success: false,
        message: message || "An unexpected error occurred during import",
      };
    }
  },

  async exportDocx(resume: Resume, templateId: string, filename: string = "resume.docx"): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/export/docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, template_id: templateId, filename }),
      });

      if (!response.ok) {
        throw new Error("Failed to export DOCX");
      }

      return await response.blob();
    } catch (error) {
      console.error("Error exporting DOCX:", error);
      throw error;
    }
  },

  async exportPdf(resume: Resume, templateId: string, filename: string = "resume.pdf", settings?: any): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/export/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, template_id: templateId, filename, settings }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(`Failed to export PDF: ${response.status} ${errorText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }
};
