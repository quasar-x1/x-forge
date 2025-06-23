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
        chalk.red(
          "No config file found. Please run 'forge init' to initialize Forge.",
        ),
      );
      return;
    }

    console.log(chalk.blue("📁 Scanning for files..."));
    const scanner = new FileScanner(config);
    const files = await scanner.getFiles();

    if (files.length === 0) {
      console.log(chalk.red("No files found to check."));
      return;
    }

    console.log(chalk.blue("🔍 Checking files..."));

    const runner = new CheckerRunner(config);
    const issues = await runner.run(files);

    console.log(chalk.red("Issues found:", issues.issues.length));
    console.log("Issues:", issues);
  } catch (error) {
    console.error(chalk.red("Error loading config file:", error));
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
