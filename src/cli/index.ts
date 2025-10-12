import { Command } from "commander";
import { initCommand } from "./init";
import { checkCommand } from "./check";
import { fixCommand } from "./fix";

const program = new Command();

program.name("forge").description("Code quality toolkit").version("1.0.0");

initCommand(program);
checkCommand(program);
fixCommand(program);

program.parse(process.argv);
