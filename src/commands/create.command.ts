import { create } from "@/actions/create.actions";
import type { Input } from "@/lib/actions/input";
import { Command } from "commander";

export const createCommand = async (program: Command): Promise<void> => {
    program
        .command('create <name> <path>')
        .alias('c')
        .description('Create router folder structure')
        .action(async (
            name: string,
            path: string
        ) => {
            const input: Input[] = [
                { name: 'name', value: name },
                { name: 'path', 'value': path }
            ];
            await create(input);
        });
}