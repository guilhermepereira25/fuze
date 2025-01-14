import { Command } from "commander";
import { createCommand } from "./create.command";

export const initCommands = async (program: Command): Promise<void> => {
    await createCommand(program);

    await handleInvalidCommand(program);
}

const handleInvalidCommand = async (program: Command) => {
    program.on('command:*', () => {
        console.error(
            'Invalid command ' + program.args.join('')
        );
        process.exit(1);
    })
}