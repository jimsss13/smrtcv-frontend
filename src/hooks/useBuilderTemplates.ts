import { useState, useEffect, useCallback } from "react";
import { useClientResumeStore, useResumeActions } from "@/hooks/useClientResumeStore";
import { useShallow } from 'zustand/react/shallow';
import { Template, TemplateConfig } from "@/types/template";

const TEMPLATE_REGISTRY_URL = process.env.NEXT_PUBLIC_TEMPLATES_JSON_URL;

/**
 * Hook to manage resume templates.
 * Fetches templates from Azure Blob Storage using SAS URLs.
 */
export function useBuilderTemplates() {
  const { templates, selectedTemplate } = useClientResumeStore(
    useShallow((state) => ({ 
      templates: state.templates, 
      selectedTemplate: state.selectedTemplate,
    }))
  );

  const { setTemplates, setSelectedTemplate } = useResumeActions();

  const [rawTemplate, setRawTemplate] = useState<string | null>(null);
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Template Registry
  useEffect(() => {
    async function fetchRegistry() {
      if (!TEMPLATE_REGISTRY_URL) {
        console.error("TEMPLATE_REGISTRY_URL is not defined in environment variables");
        setError("Configuration error: Template registry URL is missing.");
        return;
      }

      // If templates are already loaded, don't fetch again unless we want to force refresh
      // But we keep it simple for now and only fetch if empty
      if (templates.length > 0) return;

      try {
        setIsLoading(true);
        const response = await fetch(TEMPLATE_REGISTRY_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to fetch template registry: ${response.statusText}`);
        
        const data = await response.json();
        console.log("Fetched templates:", data);
        setTemplates(data);
        
        // Auto-select first template if none selected
        if (!selectedTemplate && data.length > 0) {
          setSelectedTemplate(data[0].id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Error fetching template registry:", message);
        setError("Failed to load templates. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegistry();
  }, [templates.length, selectedTemplate, setTemplates, setSelectedTemplate]);

  // 2. Fetch Selected Template Resources (HTML & Config)
  useEffect(() => {
    async function fetchTemplateResources() {
      if (!selectedTemplate || templates.length === 0) return;

      const template = templates.find(t => t.id === selectedTemplate);
      if (!template || !template.html_sas_url) return;

      // Avoid re-fetching if we already have the data for this template
      // We check if templateConfig exists and matches the current template id
      // Or if rawTemplate is already set and we don't need a refresh
      // This helps prevent unnecessary state updates that trigger re-renders
      
      try {
        setIsLoading(true);
        setError(null);

        // Fetch HTML and Config in parallel
        const [htmlRes, configRes] = await Promise.all([
          fetch(template.html_sas_url),
          template.config_json_sas_url ? fetch(template.config_json_sas_url) : Promise.resolve(null)
        ]);

        if (!htmlRes.ok) throw new Error("Failed to fetch template HTML");
        
        const html = await htmlRes.text();
        const config = configRes && configRes.ok ? await configRes.json() : {};

        // Add CSS URL to config so useBuilderPreview can inject it
        if (template.css_sas_url) {
          config.cssUrls = [template.css_sas_url];
        }

        setRawTemplate(prev => prev === html ? prev : html);
        setTemplateConfig(prev => {
          const newConfigStr = JSON.stringify(config);
          const prevConfigStr = JSON.stringify(prev);
          return newConfigStr === prevConfigStr ? prev : config;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Error fetching template resources:", message);
        setError("Failed to load template preview.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplateResources();
  }, [selectedTemplate, templates]);

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    rawTemplate,
    templateConfig,
    isLoading,
    error
  };
}
