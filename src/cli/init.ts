import fs from "fs";
import chalk from "chalk";
import yaml from "js-yaml";
import inquirer from "inquirer";
import { Command } from "commander";
import { ForgeConfig } from "../core/config";

interface Question {
  type: "input" | "list" | "checkbox" | "confirm";
  name: string;
  message: string;
  choices?: string[];
}

interface LanguageConfig {
  tools: string[];
  extensions: string[];
  defaultRules?: string;
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

const languageConfigs: Record<string, LanguageConfig> = {
  JavaScript: {
    tools: ["eslint", "prettier"],
    extensions: [".js", ".jsx"],
    defaultRules: "standard",
  },
  TypeScript: {
    tools: ["eslint", "prettier", "@typescript-eslint/eslint-plugin"],
    extensions: [".ts", ".tsx"],
    defaultRules: "typescript-recommended",
  },
};

async function initForge() {
  console.log(chalk.blue("🔧 Setting up X-Forge for your project..."));

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
      "node_modules/",
      "dist/",
      "packages.json",
      "yarn.lock",
      "package-lock.json",
    ],
  };

  try {
    const yamlContent = yaml.dump(config);
    fs.writeFileSync(".forge.yml", yamlContent, "utf8");
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
        if (!fs.existsSync(".forge.yml")) {
          await initForge();
        } else {
          console.log(chalk.red("Forge is already initialized"));
        }
      } catch (error) {
        console.error(chalk.red("Error initializing Forge:"), error);
      }
    });
}
