import { useState, useEffect } from "react";
import { Resume } from "@/types/resume-builder";
import { ExportSettings } from "@/types/resume-builder";
import { bindDataToScope } from "@/lib/builder-utils";

/**
 * Hook to generate the final preview HTML by binding resume data and export settings
 * to the raw HTML template.
 */
export function useBuilderPreview(
  rawTemplate: string | null,
  resume: Resume,
  settings: ExportSettings
) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!rawTemplate) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawTemplate, "text/html");
      
      // 1. Inject Dynamic Styles based on Export Settings
      const marginMap = { narrow: '10mm', normal: '20mm', wide: '30mm' };
      const fontSizeMap = { small: '10pt', medium: '12pt', large: '14pt' };
      
      const styleTag = doc.createElement('style');
      styleTag.textContent = `
        :root {
          --primary-color: ${settings.primaryColor};
          --font-size: ${fontSizeMap[settings.fontSize]};
          --page-margin: ${marginMap[settings.margins]};
        }
        @page {
          size: ${settings.pageSize};
          margin: var(--page-margin);
        }
        body {
          font-size: var(--font-size);
          color: #1a1a1a;
          line-height: 1.5;
        }
        .text-primary { color: var(--primary-color) !important; }
        .bg-primary { background-color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
      `;
      doc.head.appendChild(styleTag);

      // 2. Bind Resume Data to the Template
      bindDataToScope(doc.documentElement, resume);

      const serializer = new XMLSerializer();
      setPreviewHtml(serializer.serializeToString(doc));
    } catch (error) {
      console.error("Error generating preview HTML:", error);
      setPreviewHtml("Error rendering preview.");
    }
  }, [rawTemplate, resume, settings]);

  return previewHtml;
}
