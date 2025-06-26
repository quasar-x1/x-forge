import fs from "fs";
import path from "path";
import type { Linter } from "eslint";
import { languageConfigs } from "./language-config";

// export interface EslintConfig {
//   extends?: string[];
//   rules?: Record<string, any>;
// }

export interface PrettierConfig {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: "none" | "es5" | "all";
  bracketSpacing?: boolean;
  arrowParens?: "avoid" | "always";
}

// const defaultEslintConfig: Linter.Config = {
//   extends: ["eslint:recommended"],
//   rules: {
//     "no-console": "warn",
//     "no-debugger": "warn",
//     "no-unused-vars": "warn",
//   },
// };

const defaultPrettierConfig: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
};

const prettierFormat = `import { type Config } from "prettier";

  const config: Config = {
    ...defaultPrettierConfig,
  };

  export default config;
  `;

export async function writeConfig(): Promise<void> {
  if (fs.existsSync(path.join(process.cwd(), ".prettier.config.js"))) {
    console.log("Prettier config already exists");
    return;
  }

  await fs.promises.writeFile(
    path.join(process.cwd(), ".prettier.config.js"),
    prettierFormat,
  );
}
