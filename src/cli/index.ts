import {Command} from "commander";
import {initCommand} from "./init";
import {checkCommand} from "./check";

const program = new Command();

program.name("forge").description("Code quality toolkit").version("1.0.0");

initCommand(program);
checkCommand(program);

program.parse(process.argv);