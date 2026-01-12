// Centralized CDN Logic
// In production, this environment variable will point to 'https://cdn.smartcv.com'
// In development, it falls back to an empty string (relative path) or a specific local server.

const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || '';

export function getCdnUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (!CDN_BASE) {
    return `/${cleanPath}`;
  }

  return `${CDN_BASE}/${cleanPath}`;
}

export function getTemplateImageUrl(filename: string): string {
  return getCdnUrl(`templates/${filename}`);
}

export function getTemplateDataUrl(): string {
  return getCdnUrl('templates/templates.json');
}
