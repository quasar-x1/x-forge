import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface PackageJson {
  type?: 'module' | 'commonjs';
}

export function getProjectType(): 'module' | 'commonjs' | 'unknown' {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent) as PackageJson;

    if (packageJson.type === 'module') {
      return 'module';
    } else if (packageJson.type === 'commonjs') {
      return 'commonjs';
    } else {
      return 'unknown';
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'ENOENT') {
        return 'unknown';
      }
    }

    if (error instanceof Error) {
      console.error(chalk.red('Error reading package.json:', error.message));
    } else {
      console.error(chalk.red('Unknown error:', String(error)));
    }

    return 'unknown';
  }
}
