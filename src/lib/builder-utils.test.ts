import { describe, it, expect } from 'vitest';
import { getValue, sanitizeHtml } from './builder-utils';

describe('builder-utils', () => {
  describe('getValue', () => {
    it('should get nested values correctly', () => {
      const obj = { a: { b: { c: 'hello' } } };
      expect(getValue(obj, 'a.b.c')).toBe('hello');
    });

    it('should return undefined for non-existent paths', () => {
      const obj = { a: { b: { c: 'hello' } } };
      expect(getValue(obj, 'a.x.y')).toBeUndefined();
    });

    it('should handle empty paths', () => {
      const obj = { a: 1 };
      expect(getValue(obj, '')).toBeUndefined();
    });
  });

  describe('sanitizeHtml', () => {
    it('should strip script tags', () => {
      const input = '<div>Hello<script>alert("xss")</script> World</div>';
      const output = sanitizeHtml(input);
      expect(output).toBe('<div>Hello World</div>');
    });

    it('should strip event handlers and clean up spaces', () => {
      const input = '<div onclick="alert(\'xss\')" onmouseover="evil()">Click me</div>';
      const output = sanitizeHtml(input);
      expect(output).toBe('<div >Click me</div>');
    });

    it('should handle empty input', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });
});
