import * as ts from 'typescript';

export interface ParsedImport {
  type: 'es6' | 'commonjs' | 'dynamic' | 'python';
  moduleSpecifier: string;
  isDefault?: boolean;
  namedImports?: { name: string; alias?: string }[];
  namespaceImport?: string;
  isFullModule?: boolean;
  identifiers: string[];
  raw?: string;
}

export interface ParserOptions {
  resolveAliases?: boolean;
  aliases?: Record<string, string>;
  fileName?: string;
}

export class ImportParser {
  private sourceFile?: ts.SourceFile;
  private code: string;
  private fileName: string;

  constructor(code: string, options: ParserOptions = {}) {
    this.code = code;
    this.fileName = options.fileName || 'temp.ts';
    if (this.isTypeScript()) {
      this.sourceFile = ts.createSourceFile(
        this.fileName,
        code,
        ts.ScriptTarget.Latest,
        true
      );
    }
  }

  private isTypeScript(): boolean {
    return this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx') || this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx');
  }

  private isPython(): boolean {
    return this.fileName.endsWith('.py');
  }

  public parse(): ParsedImport[] {
    const imports: ParsedImport[] = [];
    
    if (this.isTypeScript() && this.sourceFile) {
      this.visit(this.sourceFile, imports);
    } else if (this.isPython()) {
      this.parsePythonImports(imports);
    }
    
    return imports;
  }

  private parsePythonImports(imports: ParsedImport[]) {
    // Improved parsing for Python imports
    // Handles multi-line imports and comments
    
    // First, remove comments and join multi-line imports that use parentheses
    let cleanedCode = this.code.replace(/#.*$/gm, '');
    
    // Simple approach: find 'from ... import (...)' blocks and flatten them
    const multiLineFromImport = /from\s+([\w.]+)\s+import\s*\(([^)]+)\)/g;
    cleanedCode = cleanedCode.replace(multiLineFromImport, (match, module, named) => {
      const flattened = named.replace(/\s+/g, ' ');
      return `from ${module} import ${flattened}`;
    });

    const lines = cleanedCode.split('\n');
    // Updated regex to handle more variations
    const importRegex = /^\s*(import|from)\s+([\w.]+)(\s+import\s+([\w.,\s]+))?(\s+as\s+(\w+))?/;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const match = trimmedLine.match(importRegex);
      if (match) {
        const [raw, type, module, , named, , alias] = match;
        const parsed: ParsedImport = {
          type: 'python',
          moduleSpecifier: module,
          identifiers: [],
          raw: trimmedLine
        };

        if (type === 'import') {
          if (alias) {
            parsed.namespaceImport = alias;
            parsed.identifiers.push(alias);
          } else {
            // Handle multiple imports on one line: import os, sys
            const modules = module.split(',').map(m => m.trim());
            if (modules.length > 1) {
              modules.forEach(m => {
                imports.push({
                  type: 'python',
                  moduleSpecifier: m,
                  identifiers: [m],
                  isFullModule: true,
                  raw: trimmedLine
                });
              });
              return;
            }
            parsed.isFullModule = true;
            parsed.identifiers.push(module);
          }
        } else if (type === 'from') {
          if (named) {
            const names = named.split(',').map(n => n.trim()).filter(n => n);
            parsed.namedImports = names.map(n => {
              const parts = n.split(/\s+as\s+/);
              const name = parts[0].trim();
              const alias = parts[1] ? parts[1].trim() : undefined;
              const id = alias || name;
              parsed.identifiers.push(id);
              return { name, alias };
            });
          }
        }
        imports.push(parsed);
      }
    });
  }

  private visit(node: ts.Node, imports: ParsedImport[]) {
    // 1. ES6 Imports
    if (ts.isImportDeclaration(node)) {
      this.handleImportDeclaration(node, imports);
    }
    // 2. CommonJS requires & Dynamic imports
    else if (ts.isCallExpression(node)) {
      this.handleCallExpression(node, imports);
    }
    // 3. Export declarations with module specifiers (e.g., export { x } from './y')
    else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      this.handleExportDeclaration(node, imports);
    }

    ts.forEachChild(node, (child) => this.visit(child, imports));
  }

  private handleImportDeclaration(node: ts.ImportDeclaration, imports: ParsedImport[]) {
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
    const parsed: ParsedImport = {
      type: 'es6',
      moduleSpecifier,
      identifiers: [],
      raw: node.getText(this.sourceFile),
    };

    if (node.importClause) {
      // Default import
      if (node.importClause.name) {
        parsed.isDefault = true;
        parsed.identifiers.push(node.importClause.name.text);
      }

      // Named imports or Namespace import
      if (node.importClause.namedBindings) {
        if (ts.isNamespaceImport(node.importClause.namedBindings)) {
          parsed.namespaceImport = node.importClause.namedBindings.name.text;
          parsed.identifiers.push(parsed.namespaceImport);
        } else if (ts.isNamedImports(node.importClause.namedBindings)) {
          parsed.namedImports = node.importClause.namedBindings.elements.map((el) => {
            const name = el.propertyName ? el.propertyName.text : el.name.text;
            const alias = el.propertyName ? el.name.text : undefined;
            parsed.identifiers.push(el.name.text);
            return { name, alias };
          });
        }
      }
    } else {
      parsed.isFullModule = true;
    }

    imports.push(parsed);
  }

  private handleExportDeclaration(node: ts.ExportDeclaration, imports: ParsedImport[]) {
    if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const moduleSpecifier = node.moduleSpecifier.text;
      const parsed: ParsedImport = {
        type: 'es6',
        moduleSpecifier,
        identifiers: [],
        raw: node.getText(this.sourceFile),
      };

      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        parsed.namedImports = node.exportClause.elements.map((el) => {
          const name = el.propertyName ? el.propertyName.text : el.name.text;
          const alias = el.propertyName ? el.name.text : undefined;
          // Note: re-exports don't necessarily introduce identifiers in the current scope,
          // but they are "imported" from the module specifier.
          return { name, alias };
        });
      } else {
        parsed.isFullModule = true; // export * from '...'
      }

      imports.push(parsed);
    }
  }

  private handleCallExpression(node: ts.CallExpression, imports: ParsedImport[]) {
    const expression = node.expression;

    // require('module')
    if (ts.isIdentifier(expression) && expression.text === 'require') {
      if (node.arguments.length > 0 && ts.isStringLiteral(node.arguments[0])) {
        const moduleSpecifier = (node.arguments[0] as ts.StringLiteral).text;
        const parsed: ParsedImport = {
          type: 'commonjs',
          moduleSpecifier,
          identifiers: [],
          raw: node.getText(this.sourceFile),
        };

        // Try to find if it's assigned to something
        const parent = node.parent;
        if (ts.isVariableDeclaration(parent) && parent.initializer === node) {
          if (ts.isIdentifier(parent.name)) {
            parsed.identifiers.push(parent.name.text);
          } else if (ts.isObjectBindingPattern(parent.name)) {
            parent.name.elements.forEach((el) => {
              if (ts.isIdentifier(el.name)) {
                parsed.identifiers.push(el.name.text);
              }
            });
          }
        }

        imports.push(parsed);
      }
    }
    // import('module')
    else if (expression.kind === ts.SyntaxKind.ImportKeyword) {
      if (node.arguments.length > 0 && ts.isStringLiteral(node.arguments[0])) {
        const moduleSpecifier = (node.arguments[0] as ts.StringLiteral).text;
        imports.push({
          type: 'dynamic',
          moduleSpecifier,
          identifiers: [],
          raw: node.getText(this.sourceFile),
        });
      }
    }
  }

  public static resolvePath(modulePath: string, aliases: Record<string, string> = {}): string {
    for (const [alias, replacement] of Object.entries(aliases)) {
      const aliasBase = alias.replace('/*', '');
      const replacementBase = replacement.replace('/*', '');
      
      if (modulePath === aliasBase) {
        return replacementBase;
      }
      if (modulePath.startsWith(aliasBase + '/')) {
        return modulePath.replace(aliasBase, replacementBase);
      }
    }
    return modulePath;
  }
}
