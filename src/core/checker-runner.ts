import { execa } from "execa";
import { ForgeConfig } from "./config";
import { encode } from "node:querystring";

export interface Issue {
  file: string;
  tool: string;
  line?: number;
  column?: number;
  message: string;
  severity: "error" | "warning" | "info";
  fix?: string;
}

export interface CheckResult {
  files: string[];
  tools: string[];
  issues: Issue[];
  hasIssues: boolean;
}

export class CheckerRunner {
  private config: ForgeConfig;

  constructor(config: ForgeConfig) {
    this.config = config;
  }

  async run(files: string[]): Promise<CheckResult> {
    const issues: Issue[] = [];
    const tools: string[] = [];

    const lang = this.config.project.language;
    const enabledTools = this.config.checks[lang];

    if (enabledTools.eslint) {
      try {
        const eslintIssues = await this.runEslint(files);
        issues.push(...eslintIssues);
        tools.push("eslint");
      } catch (error) {
        console.error("Error running ESLint:", error);
      }
    }

    if (enabledTools.prettier) {
      try {
        const prettierIssues = await this.runPrettier(files);
        issues.push(...prettierIssues);
        tools.push("prettier");
      } catch (error) {
        console.error("Error running Prettier:", error);
      }
    }

    return {
      files,
      tools,
      issues,
      hasIssues: issues.some((issues) => issues.severity === "error"),
    };
  }
  private async runEslint(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];

    try {
      const eslintIssues = await execa(
        "npx",
        ["eslint", "--format=json", ...files],
        { reject: false },
      );

      const eslintResult = JSON.parse(eslintIssues.stdout);

      for (const result of eslintResult) {
        for (const message of result.messages) {
          issues.push({
            file: result.filePath,
            tool: "eslint",
            line: message.line,
            column: message.column,
            message: message.message,
            severity: message.severity === 2 ? "error" : "warning",
          });
        }
      }
    } catch (error) {
      console.error("Error running ESLint:", error);
    }

    return issues;
  }

  private async runPrettier(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];

    try {
      const prettierIssues = await execa(
        "npx",
        ["prettier", "--list-different", ...files],
        {
          reject: false,
        },
      );

      const prettierIssuesArray = prettierIssues.stdout.trim().split("\n");

      for (const filePath of prettierIssuesArray) {
        issues.push({
          file: filePath,
          tool: "prettier",
          message: "Formatting error",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error running Prettier:", error);
    }

    return issues;
  }
}
