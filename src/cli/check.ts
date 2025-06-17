import {glob} from "glob";
import {Command} from 'commander';
import {ForgeConfig} from "../core/config";

function checkFiles(files: string[]) {

}

export function checkCommand(program: Command) {
    program.command("check").description("Check project for errors").action(() => {
    })
}