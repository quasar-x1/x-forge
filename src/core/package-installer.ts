import { execa } from "execa";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { PackageInfo, languageConfigs } from "./language-config";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export class PackageInstaller {
  private PackageManager: PackageManager;

  constructor(packageManager: PackageManager = "npm") {
    this.PackageManager = packageManager;
  }

  static detectPackageManager() {
    const cwd = process.cwd();

    if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
      return "bun";
    }

    if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
      return "yarn";
    }

    if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
      return "pnpm";
    }

    if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
      return "npm";
    }

    return "npm";
  }

  async isPackageManagerInstalled() {
    try {
      await execa(this.PackageManager, ["--version"]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async runInstaller() {
    try {
      await execa(this.PackageManager, ["install"]);
      console.log(
        chalk.green(
          `Successfully installed packages using ${this.PackageManager}`,
        ),
      );
    } catch (error) {
      console.error(
        chalk.red(`Failed to install packages using ${this.PackageManager}`),
      );
      throw error;
    }
  }

  static getLanguagePackage(language: string): PackageInfo[] {
    const packageMap: Record<string, PackageInfo[]> = {
      javascript: [
        { name: "eslint", version: "^4.9.4", dev: true },
        { name: "prettier", version: "^10.9.1", dev: true },
      ],
      typescript: [
        { name: "eslint", version: "^4.9.4", dev: true },
        { name: "prettier", version: "^10.9.1", dev: true },
      ],
    };

    return packageMap[language];
  }

  async installLanguagePackage(language: string) {}
}
