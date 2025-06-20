import fs from "fs";
import yaml from "js-yaml";
import inquirer from "inquirer";
import { Command } from "commander";
import { ForgeConfig } from "../core/config";

async function initForge() {
  const initialAnswers = await inquirer.prompt([
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
  ]);

  const checkerAnswer = await inquirer.prompt([
    {
      type: "checkbox",
      name: "checkers",
      message: `Select tool for project ${initialAnswers.projectName}:`,
      choices: ["eslint", "prettier", "stylelint"],
      default: ["eslint", "prettier"],
    },
  ]);

  // const confirmAnswer = await inquirer.prompt([
  //     {
  //         type: "confirm",
  //         name: "proceed",
  //         message: "Do you want to create the .forge.yml config file?",
  //         default: true
  //     }
  // ]);
  //
  // if (!confirmAnswer.proceed) {
  //     console.log("Configuration cancelled.");
  //     return;
  // }

  const answers = { ...initialAnswers, ...checkerAnswer };
  console.log(answers);

  const config: ForgeConfig = {
    project: {
      name: answers.projectName,
      language: answers.projectLanguage,
    },
    checks: {
      [answers.projectLanguage]: {
        eslint: answers.checkers.includes("eslint"),
        prettier: answers.checkers.includes("prettier"),
        stylelint: answers.checkers.includes("stylelint"),
      },
    },
    autofix: {
      enabled: true,
    },
    ignore: [],
  };

  try {
    // Write as YAML since the filename is .forge.yml
    const yamlContent = yaml.dump(config);
    fs.writeFileSync(".forge.yml", yamlContent, "utf8");
    console.log("Forge initialized successfully");
  } catch (error) {
    console.error("Error writing config file:", error);
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
          console.log("Forge is already initialized");
        }
      } catch (error) {
        console.error("Error initializing Forge:", error);
      }
    });
}
