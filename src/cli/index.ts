import {Command} from 'commander';
import {green} from 'chalk';
import {Lib as CliModule} from '../lib/index';

import {UnknownCommand} from './commands/unknown.command';
import {DocsCommand} from './commands/docs.command';
import {UpdateCommand} from './commands/update.command';
import {HelpCommand} from './commands/help.command';

export class Cli {
  private version: string;
  private cliModule: CliModule;
  unknownCommand: UnknownCommand;
  docsCommand: DocsCommand;
  updateCommand: UpdateCommand;
  helpCommand: HelpCommand;

  commander = ['sheetbase', 'Official CLI for working with Sheetbase.'];

  unknownCommandDef: CommandDef = [
    '*',
    'Any other command will run: `npm run [cmd]`.',
  ];

  docsCommandDef: CommandDef = ['docs', 'Open documentation.'];

  updateCommandDef: CommandDef = [
    'update',
    'Update the CLI to the latest version.',
    ['-y, --yes', 'Do update now.'],
  ];

  helpCommandDef: CommandDef = [
    'help',
    'Display help.',
    ['-d, --detail', 'Show detail help.'],
  ];

  constructor() {
    this.version = require('../../package.json').version;
    this.cliModule = new CliModule();
    this.unknownCommand = new UnknownCommand(this.cliModule.terminalService);
    this.docsCommand = new DocsCommand(this.cliModule.messageService);
    this.updateCommand = new UpdateCommand(this.cliModule.terminalService);
    this.helpCommand = new HelpCommand(this.cliModule.helpService);
  }

  getApp() {
    const commander = new Command();

    // general
    const [command, description] = this.commander;
    commander
      .version(this.version, '-v, --version')
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

    // update
    (() => {
      const [command, description, yesOpt] = this.updateCommandDef;
      commander
        .command(command)
        .description(description)
        .option(...yesOpt)
        .action(options => this.updateCommand.run(this.version, options));
    })();

    // help
    (() => {
      const [command, description, detailOpt] = this.helpCommandDef;
      commander
        .command(command)
        .alias('h')
        .description(description)
        .option(...detailOpt)
        .action(options => this.helpCommand.run(this.version, options));
      commander.on('--help', () => {
        console.log('');
        console.log('Show help:');
        console.log('  $ ' + green('sheetbase help|h'));
      });
    })();

    // *
    (() => {
      const [command, description] = this.unknownCommandDef;
      commander
        .command(command)
        .description(description)
        .action(cmd => this.unknownCommand.run(cmd.args[0]));
    })();

    // updating
    if (process.argv.slice(2)[0] !== 'update') {
      this.updateCommand.checkUpdate(this.version);
    }

    return commander;
  }
}

type CommandDef = [string, string, ...Array<[string, string]>];
