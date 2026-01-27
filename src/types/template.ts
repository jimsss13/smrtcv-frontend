export interface Template {
  id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  html_sas_url?: string;
  css_sas_url?: string;
  config_json_sas_url?: string;
  thumbnail_sas_url?: string;
}

export interface TemplateConfig {
  cssUrls?: string[];
  [key: string]: unknown;
}
