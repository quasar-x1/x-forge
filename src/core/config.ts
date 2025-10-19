import fs from 'fs';
import yaml from 'js-yaml';
import { DEFAULT_IGNORE } from '../utils/ignored';

export interface ForgeConfig {
  project: {
    name: string;
    language: string;
  };
  checks: {
    [key: string]: {
      [tool: string]: boolean;
    };
  };
  autofix: {
    enabled: boolean;
  };
  ignore: string[];
}

const CONFIG_FILE = '.forge.yml';

export async function loadConfig(
  configPath: string = CONFIG_FILE
): Promise<ForgeConfig | null> {
  try {
    if (!fs.existsSync(configPath)) {
      return null;
    }

    const fileContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContent) as ForgeConfig;

    if (!config.ignore) {
      config.ignore = [...DEFAULT_IGNORE];

      return config;
    }

    return config;
  } catch (error) {
    console.error('Error loading config file:', error);
    return null;
  }
}

export function getFileExtension(language: string): string[] {
  const extensionMap: { [key: string]: string[] } = {
    JavaScript: ['js', 'jsx', 'mjs'],
    TypeScript: ['ts', 'tsx'],
  };

  return extensionMap[language] || [];
}
