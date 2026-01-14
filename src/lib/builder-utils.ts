import { Resume } from "@/types/resume-builder";

/**
 * Utility to safely get a value from a nested object using a dot-notation path.
 */
export const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * Basic HTML sanitization to prevent XSS in template rendering.
 * Strips script tags and event handlers.
 */
export const sanitizeHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/\s{2,}/g, " "); // Clean up multiple spaces
};

/**
 * Data binding engine for dynamic HTML templates.
 * Binds resume data to HTML elements using data-bind, data-list, and data-html attributes.
 * 
 * @param rootElement - The DOM element to start binding from
 * @param scopeData - The resume data to bind
 */
export const bindDataToScope = (rootElement: Element, scopeData: Resume) => {
  try {
    // 1. Handle List Containers (e.g., experience entries, skills)
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

    // 2. Handle Simple Bindings (text and HTML content)
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
          
          // 3. Handle Attribute Bindings (e.g., links)
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
