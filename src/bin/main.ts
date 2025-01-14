import { initCommands } from '@/commands/command';
import { program } from 'commander';

const main = async () => {
    program
        .name('fuze')
        .version('0.0.1')
        .description('A CLI tool to generate base structure for hono projects')
        .usage('<command> [options]')
        .helpOption('-h, --help', 'Display help for command')

    await initCommands(program);

    await program.parseAsync(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}

main();