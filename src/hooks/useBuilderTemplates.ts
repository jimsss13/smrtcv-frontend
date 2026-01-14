import { useState, useEffect, useCallback, useRef } from "react";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { Template } from "@/types/templates";

const TEMPLATE_KEY = 'selectedTemplate';

// Cache for fetched template resources to avoid redundant network calls
const templateCache = new Map<string, { html: string; config: any }>();

// Fallback templates in case remote fetch fails
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    users: '10k+',
    description: 'A clean and professional template for any industry.',
    color: '#2563eb',
    thumbnail: '',
    path: '',
    thumbnail_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/classic.png',
    html_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/classic.html?sp=r&st=2025-12-08T15:21:20Z&se=2026-12-31T23:36:20Z&sv=2024-11-04&sr=b&sig=WbOLJJAeomyrGYWsT9OmGCjM53%2F32jUhF4rE6w2l98c%3D',
    config_json_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/config.json',
    css_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template1/style.css'
  },
  {
    id: 'traditional',
    name: 'Executive Traditional',
    users: '8k+',
    description: 'Classic layout for experienced professionals.',
    color: '#1e293b',
    thumbnail: '',
    path: '',
    thumbnail_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/traditional.png',
    html_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/traditional.html',
    config_json_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/config.json',
    css_sas_url: 'https://devsmrtcvstgtemplates.blob.core.windows.net/templates/template2/style.css'
  }
];

/**
 * Hook to manage resume templates.
 * Handles fetching the template registry and individual template sub-resources.
 */
export function useBuilderTemplates() {
  const { templates, selectedTemplate } = useClientResumeStore(
    useCallback((state) => ({ 
      templates: state.templates, 
      selectedTemplate: state.selectedTemplate,
    }), [])
  );

  const { setTemplates, setSelectedTemplate } = useResumeActions();

  const [rawTemplate, setRawTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef<string | null>(null);

  // 1. Fetch Template Registry
  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesUrl = process.env.NEXT_PUBLIC_TEMPLATES_JSON_URL;
      
      try {
        if (!templatesUrl) throw new Error("Templates URL configuration missing");

        const res = await fetch(templatesUrl, { mode: 'cors', cache: 'default' });
        if (!res.ok) throw new Error(`Failed to fetch templates: ${res.statusText}`);
        
        const data: Template[] = await res.json();
        setTemplates(data);

        // Initial template selection logic
        const params = new URLSearchParams(window.location.search);
        const queryTemplate = params.get('template');
        if (queryTemplate && data.find(t => t.id === queryTemplate)) {
          setSelectedTemplate(queryTemplate);
        } else {
          const saved = localStorage.getItem(TEMPLATE_KEY);
          if (saved && data.find(t => t.id === saved)) {
            setSelectedTemplate(saved);
          } else if (data.length > 0) {
            setSelectedTemplate(data[0].id);
          }
        }
      } catch (err) {
        console.warn("Using fallback templates due to fetch error:", err);
        setTemplates(FALLBACK_TEMPLATES);
        if (!selectedTemplate) setSelectedTemplate(FALLBACK_TEMPLATES[0].id);
      }
    };

    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [setTemplates, setSelectedTemplate, selectedTemplate, templates.length]);

  /**
   * Pre-fetches a template's resources and caches them
   */
  const preFetchTemplate = useCallback(async (template: Template) => {
    if (!template.html_sas_url || !template.config_json_sas_url || templateCache.has(template.id)) {
      return;
    }

    try {
      const [htmlRes, configRes] = await Promise.all([
        fetch(template.html_sas_url, { cache: 'force-cache' }),
        fetch(template.config_json_sas_url, { cache: 'force-cache' })
      ]);

      if (htmlRes.ok && configRes.ok) {
        const html = await htmlRes.text();
        const config = await configRes.json();
        templateCache.set(template.id, { html, config });
      }
    } catch (err) {
      console.error(`Error pre-fetching template ${template.id}:`, err);
    }
  }, []);

  // 2. Fetch Selected Template Resources with Enhanced CSS Loading
  useEffect(() => {
    const templateConfig = templates.find((t: Template) => t.id === selectedTemplate);
    if (!templateConfig || !templateConfig.html_sas_url || fetchInProgress.current === selectedTemplate) return;

    const fetchResources = async () => {
      setIsLoading(true);
      setError(null);
      fetchInProgress.current = selectedTemplate;

      try {
        let htmlContent: string;
        let configData: any;

        // Check cache first
        if (templateCache.has(selectedTemplate)) {
          const cached = templateCache.get(selectedTemplate)!;
          htmlContent = cached.html;
          configData = cached.config;
        } else {
          const [htmlRes, configRes] = await Promise.all([
            fetch(templateConfig.html_sas_url!),
            fetch(templateConfig.config_json_sas_url!)
          ]);

          if (!htmlRes.ok) throw new Error("Failed to load template HTML");
          if (!configRes.ok) throw new Error("Failed to load template configuration");

          htmlContent = await htmlRes.text();
          configData = await configRes.json();
          
          // Cache for future use
          templateCache.set(selectedTemplate, { html: htmlContent, config: configData });
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        // Inject config data into the template for dynamic behaviors
        const script = doc.createElement('script');
        script.textContent = `window.templateConfigData = ${JSON.stringify(configData)};`;
        doc.head.appendChild(script);

        // Robust CSS Loading: Handle multiple CSS files and fallback
        const styleLinks = doc.querySelectorAll('link[rel="stylesheet"]');
        const sasUrls = templateConfig.css_sas_urls || (templateConfig.css_sas_url ? [templateConfig.css_sas_url] : []);

        styleLinks.forEach((link, index) => {
          const href = link.getAttribute('href');
          // Only replace relative links
          if (href && !href.startsWith('http')) {
            const sasUrl = sasUrls[index] || sasUrls[0]; // Use indexed SAS URL or fallback to the first one
            if (sasUrl) {
              link.setAttribute('href', sasUrl);
            }
          }
        });

        // Add pre-fetch hints for other popular templates
        const popularTemplates = templates.filter(t => t.popular && t.id !== selectedTemplate).slice(0, 2);
        popularTemplates.forEach(preFetchTemplate);

        const serializer = new XMLSerializer();
        setRawTemplate(serializer.serializeToString(doc));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error loading template resources";
        console.error(message, err);
        setError(message);
        setRawTemplate(null);
      } finally {
        setIsLoading(false);
        fetchInProgress.current = null;
      }
    };

    fetchResources();
  }, [selectedTemplate, templates, preFetchTemplate]);

  return { 
    templates, 
    selectedTemplate, 
    setSelectedTemplate, 
    rawTemplate, 
    isLoading, 
    error,
    preFetchTemplate 
  };
}
