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
    const normalizedLanguage = language.toLowerCase();
    const config = Object.values(languageConfigs).find((config) =>
      Object.keys(languageConfigs).find(
        (key) => key.toLowerCase() === normalizedLanguage,
      ),
    );

    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    return config.packages;
  }

  async installLanguagePackage(language: string) {
    const packages = PackageInstaller.getLanguagePackage(language);

    for (const pkg of packages) {
      const installArgs = ["install"];

      if (pkg.dev) {
        installArgs.push("--save-dev");
      }

      const packageName = pkg.version ? `${pkg.name}@${pkg.version}` : pkg.name;
      installArgs.push(packageName);

      await execa(this.PackageManager, installArgs);
    }
  }
}
