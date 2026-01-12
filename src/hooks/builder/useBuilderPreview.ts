import { useState, useEffect, useRef, useCallback } from "react";
import { useClientResumeStore } from "@/hooks/useClientResumeStore";
import { Resume } from "@/types/resume-builder";
import { Template } from "@/types/templates";

// --- Constants ---
const TEMPLATE_KEY = 'selectedTemplate';

// Fallback templates in case remote fetch fails
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    thumbnail_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/classic.png',
    html_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/classic.html?sp=r&st=2025-12-08T15:21:20Z&se=2026-12-31T23:36:20Z&sv=2024-11-04&sr=b&sig=WbOLJJAeomyrGYWsT9OmGCjM53%2F32jUhF4rE6w2l98c%3D',
    config_json_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/config.json',
    css_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/style.css'
  },
  {
    id: 'traditional',
    name: 'Executive Traditional',
    thumbnail_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/traditional.png',
    html_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/traditional.html',
    config_json_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/config.json',
    css_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/style.css'
  }
];

// --- Utilities ---
const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const sanitizeHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
};

const bindDataToScope = (rootElement: Element, scopeData: Resume) => {
  try {
    const listContainers = Array.from(rootElement.querySelectorAll('[data-list]'));
    listContainers.forEach(container => {
      try {
        const listKey = container.getAttribute('data-list') || '';
        const listData = getValue(scopeData, listKey);
        const templateItem = container.querySelector('[data-template="item"], [data-template="sub-item"]');
        
        if (Array.isArray(listData) && templateItem) {
          const itemBlueprint = templateItem.cloneNode(true) as Element;
          itemBlueprint.removeAttribute('data-template');
          container.innerHTML = '';
          
          listData.forEach(itemData => {
            try {
              const newItem = itemBlueprint.cloneNode(true) as Element;
              const contextData = typeof itemData === 'object' ? itemData : { ui: itemData };
              bindDataToScope(newItem, contextData as Resume);
              container.appendChild(newItem);
            } catch (itemError) {
              console.error(`Error binding list item for ${listKey}:`, itemError);
            }
          });
        }
      } catch (listError) {
        console.error(`Error processing list container:`, listError);
      }
    });

    const bindElements = Array.from(rootElement.querySelectorAll('[data-bind]'));
    bindElements.forEach(el => {
      try {
        const key = el.getAttribute('data-bind') || '';
        const val = getValue(scopeData, key);
        
        if (val !== undefined && val !== null) {
          const isHtml = el.hasAttribute('data-html');
          if (isHtml) {
            el.innerHTML = sanitizeHtml(String(val));
          } else {
            el.textContent = String(val);
          }
          
          const attrPattern = el.getAttribute('data-attr-href');
          if (attrPattern) {
            el.setAttribute('href', attrPattern.replace(`{{${key}}}`, String(val)));
          }
        }
      } catch (bindError) {
        console.error(`Error binding element for ${el.getAttribute('data-bind')}:`, bindError);
      }
    });
  } catch (globalError) {
    console.error("Critical error in bindDataToScope:", globalError);
  }
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * useBuilderPreview Hook
 * Manages the fetching of templates, binding of resume data, and scaling of the preview iframe.
 */
export const useBuilderPreview = () => {
  const { 
    resume, 
    selectedTemplate, 
    setSelectedTemplate, 
    exportSettings,
    templates, 
    setTemplates 
  } = useClientResumeStore(
    useCallback((state) => ({ 
      resume: state.resume, 
      selectedTemplate: state.selectedTemplate, 
      setSelectedTemplate: state.setSelectedTemplate,
      exportSettings: state.exportSettings,
      templates: state.templates,
      setTemplates: state.setTemplates
    }), [])
  );

  const debouncedResume = useDebounce(resume, 200);
  const debouncedSettings = useDebounce(exportSettings, 200);
  
  const [rawTemplate, setRawTemplate] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch template index
  useEffect(() => {
    const fetchTemplatesFromIndex = async () => {
      const templatesJsonSasUrl = process.env.NEXT_PUBLIC_TEMPLATES_JSON_URL;
      try {
        if (!templatesJsonSasUrl) throw new Error("Templates URL not defined.");

        const templatesRes = await fetch(templatesJsonSasUrl, { mode: 'cors', cache: 'no-cache' });
        if (!templatesRes.ok) throw new Error(`HTTP error ${templatesRes.status}`);
        
        const data: Template[] = await templatesRes.json();
        setTemplates(data);

        // Handle template selection from URL or LocalStorage
        const params = new URLSearchParams(window.location.search);
        const qp = params.get('template');
        const templateMap = data.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as Record<string, Template>);

        if (qp && templateMap[qp]) {
          setSelectedTemplate(qp);
        } else {
          const saved = localStorage.getItem(TEMPLATE_KEY);
          if (saved && templateMap[saved]) setSelectedTemplate(saved);
        }
      } catch (error) {
        console.error("Template fetch failed, using fallbacks:", error);
        setTemplates(FALLBACK_TEMPLATES);
        const saved = localStorage.getItem(TEMPLATE_KEY);
        const fallbackIds = FALLBACK_TEMPLATES.map(t => t.id);
        if (!saved || !fallbackIds.includes(saved)) {
          setSelectedTemplate(FALLBACK_TEMPLATES[0].id);
        } else {
          setSelectedTemplate(saved);
        }
      }
    };
    fetchTemplatesFromIndex();
  }, [setTemplates, setSelectedTemplate]);

  // 2. Fetch specific template resources (HTML, Config)
  useEffect(() => {
    const templateConfig = templates.find((t: Template) => t.id === selectedTemplate);
    if (!templateConfig?.html_sas_url || !templateConfig?.config_json_sas_url) {
      setRawTemplate(null);
      return;
    }

    const fetchResource = async (url: string) => {
      const res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
      if (!res.ok) throw new Error(`Fetch failed for ${url}`);
      return url.includes('.json') ? res.json() : res.text();
    };

    Promise.all([
      fetchResource(templateConfig.html_sas_url),
      fetchResource(templateConfig.config_json_sas_url)
    ])
    .then(([htmlContent, configData]) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Inject config data
      const script = doc.querySelector('script');
      if (script) {
        const newScript = doc.createElement('script');
        newScript.textContent = `window.templateConfigData = ${JSON.stringify(configData)};`;
        script.parentNode?.replaceChild(newScript, script);
      }

      // Update stylesheet paths
      const styleLinks = doc.querySelectorAll('link[rel="stylesheet"]');
      styleLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && templateConfig.css_sas_url) {
          link.setAttribute('href', templateConfig.css_sas_url);
        }
      });

      const serializer = new XMLSerializer();
      setRawTemplate(serializer.serializeToString(doc));
    })
    .catch((err) => {
      console.error("Error loading template resources:", err);
      setRawTemplate(null);
    });
  }, [selectedTemplate, templates]);

  // 3. Bind data to template and generate preview HTML
  useEffect(() => {
    if (!rawTemplate) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawTemplate, "text/html");
      
      const marginMap = { narrow: '10mm', normal: '20mm', wide: '30mm' };
      const fontSizeMap = { small: '10pt', medium: '12pt', large: '14pt' };
      
      const styleTag = doc.createElement('style');
      styleTag.textContent = `
        :root {
          --primary-color: ${debouncedSettings.primaryColor};
          --font-size: ${fontSizeMap[debouncedSettings.fontSize]};
          --page-margin: ${marginMap[debouncedSettings.margins]};
        }
        @page { size: ${debouncedSettings.pageSize}; margin: var(--page-margin); }
        body { font-size: var(--font-size); color: #1a1a1a; line-height: 1.5; }
        .text-primary { color: var(--primary-color) !important; }
        .bg-primary { background-color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
      `;
      doc.head.appendChild(styleTag);

      bindDataToScope(doc.documentElement, debouncedResume);
      const serializer = new XMLSerializer();
      setPreviewHtml(serializer.serializeToString(doc));
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewHtml("Error rendering preview.");
    }
  }, [rawTemplate, debouncedResume, debouncedSettings]);

  // 4. Handle scaling
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 48;
      const standardWidth = 794; // A4 at 96 DPI
      setScale(availableWidth < standardWidth ? availableWidth / standardWidth : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    previewHtml,
    scale,
    containerRef,
    selectedTemplate,
    setSelectedTemplate,
    resume
  };
};
