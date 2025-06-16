import { Command } from "commander";
const program = new Command();

program.name("forge").description("Code quality toolkit").version("1.0.0");

program.parse(process.argv);