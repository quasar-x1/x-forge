import fs from "fs";
import { ForgeConfig, getFileExtension } from "./config";

export class FileScanner {
  config: ForgeConfig;
  extension: string[];

  constructor(config: ForgeConfig) {
    this.config = config;
    this.extension = getFileExtension(config.project.language);
  }

  async getFiles() {
    const startDirectory = process.cwd();
    const files = await this.scanDirectory(startDirectory);

    return files.filter((file) => !this.ignoredFiles().includes(file));
  }

  private async scanDirectory(directory: string) {
    const files: string[] = [];

    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = `${directory}/${entry.name}`;

        if (entry.isDirectory()) {
          if (
            !entry.name.startsWith(".") &&
            !this.ignoredFiles().includes(entryPath)
          ) {
            const subFiles = await this.scanDirectory(entryPath);
            files.push(...subFiles);
          }
        } else if (entry.isFile()) {
          if (this.extension.includes(entry.name.split(".").pop() || "")) {
            files.push(entryPath);
          }
        }
      }
    } catch (error) {
      console.error("Error scanning directory:", error);
    }

    return files;
  }

  private ignoredFiles() {
    if (!this.config.ignore) {
      return [];
    }

    return this.config.ignore;
  }
}
