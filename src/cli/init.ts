import fs from "fs";
import chalk from "chalk";
import yaml from "js-yaml";
import inquirer from "inquirer";
import { Command } from "commander";
import { ForgeConfig } from "../core/config";
import { PackageInstaller, PackageManager } from "../core/package-installer";
import { languageConfigs } from "../core/language-config";

interface Question {
  type: "input" | "list" | "checkbox" | "confirm";
  name: string;
  message: string;
  choices?: string[];
}

const initialQuestions: Question[] = [
  {
    type: "input",
    name: "projectName",
    message: "Enter project name:",
  },
  {
    type: "list",
    name: "projectLanguage",
    message: "Select project language:",
    choices: ["JavaScript", "TypeScript"],
  },
];

async function getPackageManager(): Promise<PackageManager> {
  const detectedPackageManager = PackageInstaller.detectPackageManager();

  if (!detectedPackageManager) {
    console.log("No package manager detected.");
    process.exit(1);
  }

  const confirmPackageManager = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message: `Use ${detectedPackageManager} for installing packages?`,
      default: true,
    },
  ]);

  let selectedPackageManager = detectedPackageManager;

  if (!confirmPackageManager.proceed) {
    const selectPackageManager = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Select correct package manager:",
        choices: ["npm", "bun", "yarn", "pnpm"],
      },
    ]);

    const selectedPackageManager = selectPackageManager.packageManager;
    console.log("Selected Package Manager:", selectedPackageManager);
  }

  return selectedPackageManager as PackageManager;
}

async function initForge() {
  console.log(chalk.blue("ㇺ Setting up X-Forge for your project..."));

  const initialAnswers = await inquirer.prompt(initialQuestions);
  const selectedConfig = languageConfigs[initialAnswers.projectLanguage];

  const confirmAnswer = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message: "Create initial configuration?",
      default: true,
    },
  ]);

  if (!confirmAnswer.proceed) {
    console.log(chalk.red("Configuration cancelled."));
    return;
  }

  const { installPackages } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installPackages",
      message: "Install required packages?",
      default: true,
    },
  ]);

  let packageManager: PackageManager = "npm";

  if (installPackages) {
    packageManager = await getPackageManager();
  }

  const config: ForgeConfig = {
    project: {
      name: initialAnswers.projectName,
      language: initialAnswers.projectLanguage,
    },
    checks: {
      [initialAnswers.projectLanguage]: {
        ...Object.fromEntries(selectedConfig.tools.map((tool) => [tool, true])),
      },
    },
    autofix: {
      enabled: true,
    },
    ignore: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".git",
      "packages.json",
      "package.json",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      "*.min.js",
    ],
  };

  try {
    const yamlContent = yaml.dump(config);
    fs.writeFileSync(".forge.yml", yamlContent, "utf8");

    if (installPackages) {
      console.log("ㇺ Installing Packages...");

      const installer = new PackageInstaller(packageManager);
      await installer.installLanguagePackage(initialAnswers.projectLanguage);
    }

    console.log(chalk.green("Forge initialized successfully"));
  } catch (error) {
    console.error(chalk.red("Error writing config file:"), error);
    throw error;
  }
}

export function initCommand(program: Command) {
  program
    .command("init")
    .description("Initialize forge in project")
    .action(async () => {
      try {
        if (fs.existsSync(".forge.yml")) {
          console.log(
            chalk.yellow("🗴 X-Forge is already initialized in this project"),
          );

          const overwrite = await inquirer.prompt([
            {
              type: "confirm",
              name: "overwrite",
              message: "Do you want to overwrite the existing configuration?",
              default: false,
            },
          ]);

          if (!overwrite.overwrite) {
            console.log(chalk.gray("Configuration preserved."));
            return;
          }
        }
        await initForge();
      } catch (error) {
        console.error(chalk.red("Error initializing Forge:"), error);
      }
    });
}
