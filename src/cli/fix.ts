import { Command } from "commander";
import { loadConfig } from "../core/config";
import { Fixer } from "../core/fixer";
import chalk from "chalk";

async function fixProject() {
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

    console.log(chalk.blue(" Fixing files..."));
    const fixer = new Fixer(config);
    await fixer.fix();
  } catch (error) {
    console.error(chalk.red("󰮘 Error fixing files:", error));
    process.exit(1);
  }
}

export function fixCommand(program: Command) {
  program
    .command("fix")
    .description("Fix project")
    // .argument("<projectPath>", "Path to project")
    .action(async () => {
      await fixProject();
    });

  return program;
}
