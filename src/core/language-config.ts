export interface PackageInfo {
  name: string;
  version?: string;
  dev?: boolean;
}

export interface LanguageConfig {
  tools: string[];
  extensions: string[];
  defaultRules?: string;
  packages: PackageInfo[];
}

export const languageConfigs: Record<string, LanguageConfig> = {
  JavaScript: {
    tools: ["eslint", "prettier"],
    extensions: [".js", ".jsx"],
    defaultRules: "standard",
    packages: [
      { name: "eslint", version: "^9.29.0", dev: true },
      { name: "prettier", version: "^3.6.1", dev: true },
    ],
  },
  TypeScript: {
    tools: ["eslint", "prettier", "@typescript-eslint/eslint-plugin"],
    extensions: [".ts", ".tsx"],
    defaultRules: "typescript-recommended",
    packages: [
      { name: "eslint", version: "^9.29.0", dev: true },
      { name: "prettier", version: "^3.6.1", dev: true },
      {
        name: "@typescript-eslint/eslint-plugin",
        version: "^8.35.0",
        dev: true,
      },
    ],
  },
};
