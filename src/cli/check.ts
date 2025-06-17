import {Command} from 'commander';
import {loadConfig} from "../core/config";
import {FileScanner} from "../core/file-scanner";

interface checkResult {
    files: string[];
    tools: string[];
    issues: issue[];
}

interface issue {
    file: string;
    tool: string;
    line: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    fix?: string;
}

async function checkProject() {
    try {
        const config = await loadConfig();
        if (!config) {
            console.log("No config file found. Please run 'forge init' to initialize Forge.");
            return;
        }

        const scanner = new FileScanner(config)
        const files = await scanner.getFiles();

        if (files.length === 0) {
            console.log("No files found to check.");
            return;
        }

        console.log("Files to check:", files);
        // const results: checkResult[] = [];


    } catch (error) {
        console.error("Error loading config file:", error);
    }
}

export function checkCommand(program: Command) {
    program.command("check").description("Check project for errors").action(async () => {
        await checkProject();
    })
}