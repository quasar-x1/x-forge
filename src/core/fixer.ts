import { execa } from "execa";
import { ForgeConfig } from "../core/config";
import chalk from "chalk";
import path from "path";

export class Fixer {
  config: ForgeConfig;

  constructor(config: ForgeConfig) {
    this.config = config;
  }

  // private async gitDiff() {
  //   const { stdout } = await execa("git", ["diff", "--name-only"]);
  //   const changedFiles = stdout.split("\n").filter((f) => f.trim());

  //   if (changedFiles.length === 0) {
  //     console.log(chalk.yellow("No files needed fixing."));
  //   } else {
  //     console.log(chalk.green(`\n󰈖 Fixed ${changedFiles.length} file(s):`));
  //     for (const file of changedFiles) {
  //       console.log(chalk.dim(" - " + file));
  //     }
  //   }
  // }

  async fix() {
    const { checks, project, autofix } = this.config;

    if (!autofix?.enabled) {
      return;
    }

    const lang = project?.language;
    const tools = checks?.[lang];

    if (!tools) {
      throw new Error("Project language not specified");
      return;
    }

    if (tools.eslint) {
      try {
        const { stdout: dryRunOutput } = await execa(
          "eslint",
          ["--fix-dry-run", "--format", "json", "."],
          { reject: false },
        );

        const dryRunResults = JSON.parse(dryRunOutput);
        if (
          !dryRunOutput ||
          dryRunOutput.trim() === "" ||
          dryRunOutput.trim() === "[]"
        ) {
          console.log(chalk.whiteBright("󱀺 No files need fixing."));
          return;
        }

        const filesToFix = dryRunResults
          .filter((r: any) => {
            // hanya file yang benar-benar menghasilkan output berbeda
            return r.output && r.output.trim() !== r.source?.trim();
          })
          .map((r: any) => path.relative(process.cwd(), r.filePath));

        if (filesToFix.length === 0) {
          console.log(chalk.whiteBright("󱀺 No files need fixing."));
          return;
        }

        await execa("eslint", ["--fix", "."], { reject: false });

        console.log("󱧃 Fixed by ESLint:");
        for (const file of filesToFix) {
          console.log("  •", file);
        }

        console.log(chalk.green("󰈖 Files fixed successfully."));
      } catch (error: any) {
        console.log(chalk.red("󰮘 ESLint failed:"));
        console.log(chalk.dim(error.stderr || error.message));

        if (error.exitCode === 1) {
          console.log(chalk.yellow("  → ESLint found errors (this is normal)"));
        } else if (error.exitCode === 2) {
          console.log(
            chalk.yellow("  → Configuration error. Check eslint.config.mjs"),
          );
        } else {
          console.log(chalk.yellow("  → Unexpected error occurred"));
        }
      }
    }

    if (tools.prettier) {
      await execa("prettier", ["--write", "."]);
    }

    // await this.gitDiff();
  }
}
