import fs from 'fs';
import path from 'path';
import { ForgeConfig } from '../core/config';
import { DEFAULT_IGNORE } from '../utils/ignored';
import { getProjectType } from '../utils/check-type';

export interface PrettierConfig {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'none' | 'es5' | 'all';
  bracketSpacing?: boolean;
  arrowParens?: 'avoid' | 'always';
}

export interface ESLintConfig {
  extends?: Array<string>;
  ignores?: string[];
  files?: string[];
  languageOptions?: {
    globals?: Record<string, boolean | 'readonly' | 'writable'>;
  };
  rules?: Record<
    string,
    'off' | 'warn' | 'error' | ['off' | 'warn' | 'error', ...unknown[]]
  >;
}

const defaultPrettierConfig: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
};

const defaultESLintConfig: ESLintConfig = {
  extends: ['eslint:recommended'],
  ignores: [...DEFAULT_IGNORE, 'eslint.config.*'],
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  rules: {
    // Auto-fixable
    'no-var': 'error',
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    // Warnings
    'no-unused-vars': 'warn',
    'no-console': 'off', //warn console

    // Manual fix needed
    eqeqeq: ['warn', 'always'],
  },
};

const projectType = getProjectType();

export async function writeConfig(config: ForgeConfig): Promise<void> {
  const { project } = config;
  const lang = project?.language;

  let eslintConfigPath: string;

  if (projectType === 'module') {
    eslintConfigPath = path.join(process.cwd(), 'eslint.config.js');
  } else {
    eslintConfigPath = path.join(process.cwd(), 'eslint.config.mjs');
  }

  // Eslint Config
  if (lang !== 'JavaScript' && lang !== 'TypeScript') {
    console.log(`Unsupported language "${lang}", skipping ESLint setup.`);
    return;
  }

  if (fs.existsSync(eslintConfigPath)) {
    console.log('ESLint config already exists');
    return;
  }

  const imports = [
    'import js from "@eslint/js";',
    'import globals from "globals";',
  ];
  if (lang === 'TypeScript') {
    imports.push('import tseslint from "typescript-eslint";');
  }

  const configs = ['js.configs.recommended'];
  if (lang === 'TypeScript') {
    configs.push('...tseslint.configs.recommended');
  }

  const eslintFileContent = `
  ${imports.join('\n')}

  export default [
    ${configs.join(',\n  ')},
    {
      ignores: ${JSON.stringify(defaultESLintConfig.ignores, null, 2)},
      files: ${JSON.stringify(defaultESLintConfig.files, null, 2)},
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      rules: ${JSON.stringify(defaultESLintConfig.rules, null, 2)}
    },
  ];
  `;

  try {
    await fs.promises.writeFile(eslintConfigPath, eslintFileContent);
    console.log('Created eslint.config.js');
  } catch (error) {
    console.error('Failed to write eslint.config.js:', error);
  }

  // Prettier Config
  if (fs.existsSync(path.join(process.cwd(), '.prettierrc'))) {
    console.log('Prettier config already exists');
    return;
  } else {
    const prettierFormat = JSON.stringify(defaultPrettierConfig, null, 2);

    await fs.promises.writeFile(
      path.join(process.cwd(), '.prettierrc'),
      prettierFormat
    );
  }
}
