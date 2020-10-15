import {red} from 'chalk';
import {Command} from 'commander';
import {Lib as CliModule} from '../lib/index';
import {DocsCommand} from './commands/docs.command';
import {UnknownCommand} from './commands/unknown.command';

export class Cli {
  private cliModule: CliModule;
  docsCommand: DocsCommand;
  unknownCommand: UnknownCommand;

  commander = ['sheetbase', 'Official CLI for working with Sheetbase.'];

  docsCommandDef: CommandDef = ['docs', 'Command description.'];

  unknownCommandDef: CommandDef = ['unknown', 'Command description.'];

  constructor() {
    this.cliModule = new CliModule();
    this.docsCommand = new DocsCommand();
    this.unknownCommand = new UnknownCommand();
  }

  getApp() {
    const commander = new Command();

    // general
    const [command, description] = this.commander;
    commander
      .version(require('../../package.json').version, '-v, --version')
      .name(`${command}`)
      .usage('[options] [command]')
      .description(description);

    // docs
    (() => {
      const [command, description] = this.docsCommandDef;
      commander
        .command(command)
        .description(description)
        .action(() => this.docsCommand.run());
    })();

    // unknown
    (() => {
      const [command, description] = this.unknownCommandDef;
      commander
        .command(command)
        .description(description)
        .action(() => this.unknownCommand.run());
    })();

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
