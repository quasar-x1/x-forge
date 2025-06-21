import { execa } from "execa";
import { ForgeConfig } from "./config";

export interface Issue {
  file: string;
  tool: string;
  line: number;
  column?: number;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface CheckResult {
  files: string[];
  tools: string[];
  issues: Issue[];
  hasErrors: boolean;
}

export class CheckerRunner {
  private config: ForgeConfig;

  constructor(config: ForgeConfig) {
    this.config = config;
  }

  async run(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    const tools: string[] = [];

    const lang = this.config.project.language;
    const enabledTools = this.config.checks[lang];

    return issues;
  }
}
