import { execa } from 'execa';
import { ForgeConfig } from '../core/config';
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';

interface DryRunResult {
  filePath: string;
  source?: string;
  output?: string;
}

export class Fixer {
  config: ForgeConfig;

  constructor(config: ForgeConfig) {
    this.config = config;
  }

  private async askBefore() {
    const { yes } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'yes',
        message: 'Are you sure you want to fix the files?',
        default: false,
      },
    ]);

    if (!yes) {
      console.log(chalk.red('󰈖 Fixing cancelled.'));
      process.exit(0);
    }
  }

  async fix() {
    const { checks, project, autofix } = this.config;

    if (!autofix?.enabled) {
      return;
    }

    const lang = project?.language;
    const tools = checks?.[lang];

    if (!tools) {
      throw new Error('Project language not specified');
    }

    if (tools.eslint) {
      try {
        await this.askBefore();

        const { stdout: dryRunOutput, stderr } = await execa(
          'eslint',
          ['--fix-dry-run', '--format', 'json', '.'],
          { reject: false }
        );

        if (!dryRunOutput || dryRunOutput.trim() === '') {
          if (stderr) {
            throw new Error(stderr);
          }

          console.log(chalk.whiteBright('󱀺 No files need fixing.'));
          return;
        }

        const dryRunResults = JSON.parse(dryRunOutput);
        if (dryRunResults.length === 0) {
          console.log(chalk.whiteBright('󱀺 No files need fixing.'));
          return;
        }

        const filesToFix = dryRunResults
          .filter((r: DryRunResult) => {
            return r.output && r.output.trim() !== r.source?.trim();
          })
          .map((r: DryRunResult) => path.relative(process.cwd(), r.filePath));

        if (filesToFix.length === 0) {
          console.log(chalk.whiteBright('󱀺 No files need fixing.'));
          return;
        }

        await execa('eslint', ['--fix', '.'], { reject: false });

        console.log('󱧃 Fixed by ESLint:');
        for (const file of filesToFix) {
          console.log('  •', file);
        }

        console.log(chalk.green('󰈖 Files fixed successfully.'));
      } catch (error: unknown) {
        console.log(chalk.red('󰮘 ESLint failed:'));

        if (error instanceof Error) {
          console.log(chalk.dim(error.message));
        } else {
          console.log(chalk.dim(String(error)));
        }

        const err = error as { stderr?: string; exitCode?: number };
        if (err.exitCode === 1) {
          console.log(chalk.yellow('  → ESLint found errors (this is normal)'));
        } else if (err.exitCode === 2) {
          console.log(
            chalk.yellow('  → Configuration error. Check eslint.config.mjs')
          );
        } else {
          console.log(chalk.yellow('  → Unexpected error occurred'));
          console.error(error);
        }
      }
    }

    if (tools.prettier) {
      await execa('prettier', ['--write', '.']);
    }
  }
}
