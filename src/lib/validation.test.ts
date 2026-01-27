import { describe, it, expect } from 'vitest';
import { validateField } from './validation';

describe('Validation Logic', () => {
  it('validates basics correctly', () => {
    expect(validateField('basics.email', 'invalid-email')).toBe('Invalid email address');
    expect(validateField('basics.email', 'test@example.com')).toBeNull();
    
    expect(validateField('basics.name', 'A')).toBe('Name must be at least 2 characters');
    expect(validateField('basics.name', 'John Doe')).toBeNull();
  });

  it('validates nested location fields', () => {
    expect(validateField('basics.location.city', '')).toBe('City is required');
    expect(validateField('basics.location.city', 'New York')).toBeNull();
  });

  it('validates work experience fields', () => {
    expect(validateField('work.0.name', '')).toBe('Company name is required');
    expect(validateField('work.0.name', 'Google')).toBeNull();
    
    expect(validateField('work.0.url', 'invalid-url')).toBe('Invalid URL');
    expect(validateField('work.0.url', 'https://google.com')).toBeNull();
  });

  it('validates dynamic array fields', () => {
    // Skills
    expect(validateField('skills.0.name', '')).toBe('Skill name is required');
    expect(validateField('skills.0.name', 'React')).toBeNull();
  });
});
