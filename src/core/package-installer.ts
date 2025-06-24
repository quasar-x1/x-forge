import { execa } from "execa";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface PackageInfo {
  name: string;
  version?: string;
  dev?: boolean;
}

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

  static getLanguagePackage(languagePackage: string) {
    switch (languagePackage) {
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      default:
        throw new Error(`Unsupported language: ${languagePackage}`);
    }
  }

  async installLanguagePackage(language: string) {
    const languagePackage = PackageInstaller.getLanguagePackage(language);
    await execa(this.PackageManager, ["add", languagePackage]);
  }
}
