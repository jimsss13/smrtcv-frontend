import { Resume } from "@/types/resume";

/**
 * Utility to safely get a value from a nested object using a dot-notation path.
 */
export const getValue = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((acc: unknown, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), obj);
};

/**
 * Basic HTML sanitization to prevent XSS in rendering.
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
 * Data binding engine for dynamic HTML.
 * Binds resume data to HTML elements using data-bind, data-list, and data-html attributes.
 * 
 * @param rootElement - The DOM element to start binding from
 * @param scopeData - The resume data to bind
 */
export const bindDataToScope = (rootElement: Element, scopeData: unknown, parentKey: string = "") => {
  try {
    // 1. Handle List Containers (e.g., experience entries, skills)
    // We search for elements with [data-list], including the root itself
    const listContainers = Array.from(rootElement.querySelectorAll('[data-list]'));
    if (rootElement.hasAttribute('data-list')) {
      listContainers.unshift(rootElement);
    }

    listContainers.forEach(container => {
      try {
        const listKey = container.getAttribute('data-list') || '';
        // If we have a parentKey, the listKey might be relative or absolute
        // For now, let's try to get data from current scope
        let listData = getValue(scopeData, listKey);
        
        // If not found and we have a parentKey, try stripping the parentKey from the listKey
        if (listData === undefined && parentKey && listKey.startsWith(parentKey + '.')) {
          const relativeKey = listKey.slice(parentKey.length + 1);
          listData = getValue(scopeData, relativeKey);
        }

        // AUTO-HIDE: Hide section if no data and it's not a template element
        const hasData = Array.isArray(listData) && listData.length > 0 && listData.some(item => {
          if (typeof item === 'object' && item !== null) {
            return Object.values(item).some(val => val !== "" && val !== null && val !== undefined && (!Array.isArray(val) || val.length > 0));
          }
          return item !== "" && item !== null && item !== undefined;
        });

        if (!hasData) {
          (container as HTMLElement).style.display = 'none';
          // Also try to hide parent section if this is the main list of that section
          const parentSection = container.closest('section');
          if (parentSection) {
            parentSection.style.display = 'none';
          }
          return;
        } else {
          (container as HTMLElement).style.display = '';
          const parentSection = container.closest('section');
          if (parentSection) {
            parentSection.style.display = '';
          }
        }

        const templateItem = container.querySelector('[data-template="item"], [data-template="sub-item"]');
        
        if (Array.isArray(listData)) {
          if (templateItem) {
            const itemBlueprint = templateItem.cloneNode(true) as Element;
            itemBlueprint.removeAttribute('data-template');
            container.innerHTML = '';
            
            listData.forEach(itemData => {
              try {
                const newItem = itemBlueprint.cloneNode(true) as Element;
                
                let contextData: Record<string, unknown>;
                if (typeof itemData === 'object' && itemData !== null) {
                  contextData = { ...(itemData as Record<string, unknown>) };
                  // Compatibility: If it's a Skill-like object but the template expects 'ui'
                  if (!contextData.ui) {
                    const name = (contextData.name as string) || "";
                    const keywords = Array.isArray(contextData.keywords) ? contextData.keywords.join(', ') : "";
                    contextData.ui = (name && keywords) ? `${name}: ${keywords}` : (name || keywords || "");
                  }
                } else {
                  contextData = { ui: itemData };
                }

                // Pass the listKey as the new parentKey for recursive binding
                bindDataToScope(newItem, contextData, listKey);
                container.appendChild(newItem);
              } catch (itemError) {
                console.error(`Error binding list item for ${listKey}:`, itemError);
              }
            });
          } else {
            // FALLBACK: If no template is found, create a simple list of elements
            // This ensures compatibility with templates that rely on manual DOM insertion
            container.innerHTML = '';
            listData.forEach(itemData => {
              const el = document.createElement(container.tagName === 'UL' || container.tagName === 'OL' ? 'li' : 'span');
              
              if (typeof itemData === 'object' && itemData !== null) {
                // If it's a Skill object, format it nicely
                const skill = itemData as Record<string, unknown>;
                const name = (skill.name as string) || "";
                const keywords = Array.isArray(skill.keywords) ? (skill.keywords as string[]).join(', ') : "";
                
                if (name && keywords) {
                  el.textContent = `${name}: ${keywords}`;
                } else {
                  el.textContent = name || keywords || "";
                }
              } else {
                el.textContent = String(itemData);
              }
              
              if (el.textContent) {
                container.appendChild(el);
              }
            });
          }
        }
      } catch (listError) {
        console.error(`Error processing list container:`, listError);
      }
    });

    // 2. Handle Simple Bindings
    // We search for elements with [data-bind], including the root itself.
    // However, we must filter out elements that belong to nested lists (child scopes),
    // because they are handled by the recursive calls in Step 1.
    // If the rootElement itself is a list container, it shouldn't bind its children in this pass.

    let bindElements: Element[] = [];

    if (rootElement.hasAttribute('data-list')) {
        // If the root is a list container, only check the root itself.
        // Its children are template items handled by the list logic.
        if (rootElement.hasAttribute('data-bind')) {
            bindElements.push(rootElement);
        }
    } else {
        // Standard case: Find all bindable elements in the current scope
        const allBindElements = Array.from(rootElement.querySelectorAll('[data-bind]'));
        if (rootElement.hasAttribute('data-bind')) {
            allBindElements.unshift(rootElement);
        }

        bindElements = allBindElements.filter(el => {
            // Always bind the root itself if it has data-bind
            if (el === rootElement) return true;

            // Check if element belongs to a nested data-list
            // We traverse up until we hit rootElement.
            // If we encounter a data-list on the way, this element belongs to that child scope.
            let current = el.parentElement;
            while (current && current !== rootElement) {
                if (current.hasAttribute('data-list')) {
                    return false; // Skip: it's in a nested list
                }
                current = current.parentElement;
            }
            return true; // It's in the current scope
        });
    }

    bindElements.forEach(el => {
      try {
        const key = el.getAttribute('data-bind') || '';
        let val = getValue(scopeData, key);

        // Logic to handle absolute vs relative paths in nested scopes
        if (val === undefined && parentKey && key.startsWith(parentKey + '.')) {
          const relativeKey = key.slice(parentKey.length + 1);
          val = getValue(scopeData, relativeKey);
        }
        
        // Final fallback: if still undefined, try just the last part of the key if it matches a property in scopeData
        if (val === undefined && typeof scopeData === 'object' && scopeData !== null) {
          const lastPart = key.split('.').pop() || '';
          if (Object.prototype.hasOwnProperty.call(scopeData, lastPart)) {
            val = (scopeData as Record<string, unknown>)[lastPart];
          }
        }
        
        // Treat undefined/null as empty string to ensure placeholders are cleared
        const displayVal = (val === undefined || val === null) ? "" : String(val);

        const isHtml = el.hasAttribute('data-html');
        if (isHtml) {
          el.innerHTML = sanitizeHtml(displayVal);
        } else {
          el.textContent = displayVal;
        }
          
        // 3. Handle Attribute Bindings (e.g., links, images, styles)
        const hrefPattern = el.getAttribute('data-attr-href');
        if (hrefPattern) {
          el.setAttribute('href', hrefPattern.replace(`{{${key}}}`, displayVal));
        }

        const srcPattern = el.getAttribute('data-attr-src');
        if (srcPattern) {
          el.setAttribute('src', displayVal);
        }

        const styleWidthPattern = el.getAttribute('data-style-width');
        if (styleWidthPattern) {
          if (!displayVal) {
             (el as HTMLElement).style.width = "0%";
          } else {
             const widthVal = displayVal.includes('%') ? displayVal : `${displayVal}%`;
             (el as HTMLElement).style.width = widthVal;
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
