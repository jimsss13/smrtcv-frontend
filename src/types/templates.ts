export interface Template {
  id: string;
  name: string;
  users: string;
  description: string;
  color: string;
  popular?: boolean;
  thumbnail: string;
  path: string;
  thumbnail_sas_url?: string;
  html_sas_url?: string;
  config_json_sas_url?: string;
  css_sas_url?: string;
  css_sas_urls?: string[];
  isPreFetched?: boolean;
}