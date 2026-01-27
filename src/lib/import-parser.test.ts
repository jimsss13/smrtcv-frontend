import { describe, it, expect } from 'vitest';
import { ImportParser } from './import-parser';

describe('ImportParser', () => {
  describe('ES6 Imports', () => {
    it('should parse default imports', () => {
      const code = `import React from 'react';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        type: 'es6',
        moduleSpecifier: 'react',
        isDefault: true,
        identifiers: ['React']
      });
    });

    it('should parse named imports', () => {
      const code = `import { useState, useEffect } from 'react';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results).toHaveLength(1);
      expect(results[0].namedImports).toEqual([
        { name: 'useState', alias: undefined },
        { name: 'useEffect', alias: undefined }
      ]);
      expect(results[0].identifiers).toEqual(['useState', 'useEffect']);
    });

    it('should parse aliased named imports', () => {
      const code = `import { useState as useMyState } from 'react';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results[0].namedImports).toEqual([
        { name: 'useState', alias: 'useMyState' }
      ]);
      expect(results[0].identifiers).toEqual(['useMyState']);
    });

    it('should parse namespace imports', () => {
      const code = `import * as React from 'react';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results[0].namespaceImport).toBe('React');
      expect(results[0].identifiers).toEqual(['React']);
    });

    it('should parse side-effect imports', () => {
      const code = `import './styles.css';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results[0].isFullModule).toBe(true);
      expect(results[0].moduleSpecifier).toBe('./styles.css');
    });

    it('should parse re-exports', () => {
      const code = `export { Button } from './Button';`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results).toHaveLength(1);
      expect(results[0].moduleSpecifier).toBe('./Button');
      expect(results[0].namedImports).toEqual([{ name: 'Button', alias: undefined }]);
    });
  });

  describe('CommonJS requires', () => {
    it('should parse simple requires', () => {
      const code = `const path = require('path');`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        type: 'commonjs',
        moduleSpecifier: 'path',
        identifiers: ['path']
      });
    });

    it('should parse destructured requires', () => {
      const code = `const { join, resolve } = require('path');`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results[0].identifiers).toEqual(['join', 'resolve']);
    });
  });

  describe('Dynamic Imports', () => {
    it('should parse dynamic import()', () => {
      const code = `const module = await import('./module');`;
      const parser = new ImportParser(code);
      const results = parser.parse();
      
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('dynamic');
      expect(results[0].moduleSpecifier).toBe('./module');
    });
  });

  describe('Python Imports', () => {
    it('should parse simple python imports', () => {
      const code = `import os\nimport numpy as np`;
      const parser = new ImportParser(code, { fileName: 'test.py' });
      const results = parser.parse();
      
      expect(results).toHaveLength(2);
      expect(results[0]).toMatchObject({
        type: 'python',
        moduleSpecifier: 'os',
        isFullModule: true
      });
      expect(results[1]).toMatchObject({
        type: 'python',
        moduleSpecifier: 'numpy',
        namespaceImport: 'np'
      });
    });

    it('should parse "from ... import ..." python imports', () => {
      const code = `from os import path, environ\nfrom math import sqrt as square_root`;
      const parser = new ImportParser(code, { fileName: 'test.py' });
      const results = parser.parse();
      
      expect(results).toHaveLength(2);
      expect(results[0].moduleSpecifier).toBe('os');
      expect(results[0].namedImports).toEqual([
        { name: 'path', alias: undefined },
        { name: 'environ', alias: undefined }
      ]);
      expect(results[1].moduleSpecifier).toBe('math');
      expect(results[1].namedImports).toEqual([
        { name: 'sqrt', alias: 'square_root' }
      ]);
    });
  });

  describe('Path Resolution', () => {
    it('should resolve aliases correctly', () => {
      const aliases = {
        '@/*': './src/*'
      };
      const path = '@/components/Button';
      const resolved = ImportParser.resolvePath(path, aliases);
      expect(resolved).toBe('./src/components/Button');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed code gracefully', () => {
      const code = `import { valid } from 'module';\nimport { broken`;
      const parser = new ImportParser(code);
      // The TS compiler will still try to parse what it can
      const results = parser.parse();
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].moduleSpecifier).toBe('module');
    });
  });
});
