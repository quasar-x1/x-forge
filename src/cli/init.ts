import fs from "fs";
import inquirer from "inquirer";
import { Command } from "commander";
import yaml from "js-yaml";

const program = new Command();

interface ForgeConfig {
  project: {
    name: string;
    language: string;
  };
  checks: {
    [key: string]: {
      [tool: string]: boolean;
    };
  };
  autofix: {
    enabled: boolean;
  };
}

type QuestionType = {
  type: "input" | "list";
  name: string;
  message: string;
  choices?: string[];
};

async function initForge() {
  const questions: QuestionType[] = [
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

  const answers = await inquirer.prompt(questions);

  const config: ForgeConfig = {
    project: {
      name: answers.projectName,
      language: answers.projectLanguage,
    },
    checks: {},
    autofix: {
      enabled: true,
    },
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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
