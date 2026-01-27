import { useState, useEffect } from "react";
import { Resume } from "@/types/resume";
import { TemplateConfig } from "@/types/template";
import { ExportSettings } from "@/stores/resumeStore";
import { bindDataToScope } from "@/lib/builder-utils";

/**
 * Hook to generate the final preview HTML by binding resume data and export settings
 * to the raw HTML template.
 */
export function useBuilderPreview(
  rawTemplate: string | null,
  resume: Resume,
  settings: ExportSettings,
  templateConfig: TemplateConfig | null = null
) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!rawTemplate) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawTemplate, "text/html");
      
      // 0. Clean up the template: remove local scripts and local stylesheets
      // This prevents "ERR_ABORTED" errors for local files and data binding conflicts
      doc.querySelectorAll('script').forEach(s => s.remove());
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
        const href = l.getAttribute('href');
        // If it's a relative path (doesn't start with http/https), remove it
        if (href && !href.startsWith('http')) {
          l.remove();
        }
      });
      
      // 1. Inject Template Config Data and Styles
      if (templateConfig) {
        // Inject CSS via SAS URLs
        if (templateConfig.cssUrls && Array.isArray(templateConfig.cssUrls)) {
          templateConfig.cssUrls.forEach((url: string) => {
            const link = doc.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            doc.head.appendChild(link);
          });
        }

        const configScript = doc.createElement('script');
        configScript.textContent = `window.templateConfigData = ${JSON.stringify(templateConfig)};`;
        doc.head.insertBefore(configScript, doc.head.firstChild);
      }

      // 2. Inject Dynamic Variables based on Export Settings
      const marginMap = { narrow: '6mm', normal: '12mm', wide: '20mm' };
      const fontSizeMap = { small: '10pt', medium: '11pt', large: '12pt' };
      
      const styleTag = doc.createElement('style');
      styleTag.textContent = `
        :root {
          --primary-color: ${settings.primaryColor};
          --font-size: ${fontSizeMap[settings.fontSize]};
          --page-margin: ${marginMap[settings.margins]};
        }
        @page {
          size: ${settings.pageSize};
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: transparent !important;
        }
        /* Layout Wrappers: Ensure they fill the page width but don't force flex layout */
        .page, .container, .resume-wrapper, .main-content {
          width: 100%;
          min-height: 297mm;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* Apply margins as padding to major sections only */
        /* This allows backgrounds on these sections to touch the page edges */
        header, .main-header, section, .resume-section {
          padding-left: var(--page-margin) !important;
          padding-right: var(--page-margin) !important;
          box-sizing: border-box;
          width: 100% !important;
          position: relative;
        }

        /* Prevent double-padding on nested major elements */
        section section, 
        .resume-section .resume-section,
        header section,
        .main-header section {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* Adjust vertical spacing */
        header, .main-header {
          padding-top: calc(var(--page-margin) * 0.8) !important;
          padding-bottom: calc(var(--page-margin) * 0.4) !important;
        }
        
        section, .resume-section {
          padding-top: calc(var(--page-margin) * 0.3) !important;
          padding-bottom: calc(var(--page-margin) * 0.3) !important;
        }

        /* Target specific content containers if they exist to apply margins */
        /* but only if the parent section doesn't already have padding */
        .content-wrapper, .section-content {
          width: 100%;
          box-sizing: border-box;
        }

        /* Fix for icons and small colored elements: they should NOT break out */
        .icon, [class*="icon"], .bg-primary:not(section):not(header):not(div[style*="width: 100"]) {
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: initial;
          padding-right: initial;
        }

        /* Ensure images (like profile photos) are not distorted by margin rules */
        img {
          max-width: 100%;
          height: auto;
        }
        .text-primary { color: var(--primary-color) !important; }
        .bg-primary { background-color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
      `;
      doc.head.appendChild(styleTag);

      // 3. Bind Resume Data to the Template
      bindDataToScope(doc.documentElement, resume);

      const serializer = new XMLSerializer();
      const newHtml = serializer.serializeToString(doc);
      
      setPreviewHtml(prev => prev === newHtml ? prev : newHtml);
    } catch (error) {
      console.error("Error generating preview HTML:", error);
      setPreviewHtml("Error rendering preview.");
    }
  }, [rawTemplate, resume, settings, templateConfig]);

  return previewHtml;
}
