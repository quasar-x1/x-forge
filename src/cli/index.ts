import {Command} from "commander";
import {initCommand} from "./init";

const program = new Command();

program.name("forge").description("Code quality toolkit").version("1.0.0");

initCommand(program);

program.parse(process.argv);