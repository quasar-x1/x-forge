import { Command } from "commander";
import { loadConfig } from "../core/config";
import { FileScanner } from "../core/file-scanner";
import { CheckerRunner, Issue, CheckResult } from "../core/checker-runner";
import chalk from "chalk";

async function checkProject() {
  try {
    const config = await loadConfig();
    if (!config) {
      console.log(
        "No config file found. Please run 'forge init' to initialize Forge.",
      );
      return;
    }

    console.log(chalk.blue("📁 Scanning for files..."));
    const scanner = new FileScanner(config);
    const files = await scanner.getFiles();

    if (files.length === 0) {
      console.log("No files found to check.");
      return;
    }

    console.log("Files to check:", files);

    const runner = new CheckerRunner(config);
    const issues = await runner.run(files);

    console.log("Issues found:", issues);
  } catch (error) {
    console.error("Error loading config file:", error);
  }
}

export function checkCommand(program: Command) {
  program
    .command("check")
    .description("Check project for errors")
    .action(async () => {
      await checkProject();
    });
}
