import { initCommands } from '@/commands/command';
import { program } from 'commander';
import packageJson from '../../package.json' with { type: "json" };

const main = async () => {
    program
        .name('fuze')
        .version(packageJson.version)
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