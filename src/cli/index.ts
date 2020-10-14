import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as CliModule} from '../lib/index';

export class Cli {
  private cliModule: CliModule;

  commander = ['sheetbase', 'Official CLI for working with Sheetbase.'];

  constructor() {
    this.cliModule = new CliModule();
  }

  getApp() {
    const commander = new Command();

    // general
    const [command, description] = this.commander;
    commander
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .version(require('../../package.json').version, '-v, --version')
      .name(`${command}`)
      .usage('[options] [command]')
      .description(description);

    // help
    commander
      .command('help')
      .description('Display help.')
      .action(() => commander.outputHelp());

    // *
    commander
      .command('*')
      .description('Any other command is not supported.')
      .action(cmd => console.error(red(`Unknown command '${cmd.args[0]}'`)));

    return commander;
  }

}

type CommandDef = [string, string, ...Array<[string, string]>];
