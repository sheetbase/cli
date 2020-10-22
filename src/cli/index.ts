import {Command} from 'commander';
import {green} from 'chalk';
import {Lib as CliModule} from '../lib/index';

import {UnknownCommand} from './commands/unknown.command';
import {DocsCommand} from './commands/docs.command';
import {UpdateCommand} from './commands/update.command';
import {HelpCommand} from './commands/help.command';
import {GoogleCommand} from './commands/google.command';
import {GoogleListCommand} from './commands/google-list.command';
import {GoogleConnectCommand} from './commands/google-connect.command';
import {GoogleDisconnectCommand} from './commands/google-disconnect.command';
import {GoogleActiveCommand} from './commands/google-active.command';

export class Cli {
  private version: string;
  private cliModule: CliModule;
  unknownCommand: UnknownCommand;
  docsCommand: DocsCommand;
  updateCommand: UpdateCommand;
  helpCommand: HelpCommand;
  googleCommand: GoogleCommand;
  googleListCommand: GoogleListCommand;
  googleConnectCommand: GoogleConnectCommand;
  googleDisconnectCommand: GoogleDisconnectCommand;
  googleActiveCommand: GoogleActiveCommand;

  commander = ['sheetbase', 'Official CLI for working with Sheetbase.'];

  unknownCommandDef: CommandDef = [
    '*',
    'Any other command will run: `npm run [cmd]`.',
  ];

  docsCommandDef: CommandDef = ['docs', 'Open documentation.'];

  updateCommandDef: CommandDef = [
    ['update', 'upgrade', 'up'],
    'Update the CLI to the latest version.',
    ['-y, --yes', 'Do update now.'],
    ['-d, --deps', 'Update project dependencies.'],
  ];

  helpCommandDef: CommandDef = [
    ['help', 'usage', 'he'],
    'Display help.',
    ['-d, --detail', 'Show detail help.'],
  ];

  /**
   * @param [subCommand] - Supported sub-command
   * @param [params...] - Params for sub-command
   */
  googleCommandDef: CommandDef = [
    ['google [subCommand] [params...]', 'gg'],
    'Manage Google accounts.',
    ['-y, --yes', '(connect) Agree on account connection.'],
    ['-c, --creds', '(connect) Save credential to .googlerc.json.'],
    ['-f, --full-drive', '(connect) Not recommended, full access to Drive.'],
  ];

  googleListCommandDef: CommandDef = [
    ['google-list', 'gg-list', 'gg-show', 'ggl'],
    'List connected accounts, proxy to `google list`.',
  ];

  googleConnectCommandDef: CommandDef = [
    ['google-connect', 'gg-connect', 'gg-login', 'ggc'],
    'Connect an account, proxy to `google connect`.',
    ['-y, --yes', 'Agree on account connection.'],
    ['-c, --creds', 'Save credential to .googlerc.json.'],
    ['-f, --full-drive', 'Not recommended, full access to Drive.'],
  ];

  /**
   * @param <input> - Disconnection input: <id>, all, active, local
   */
  googleDisconnectCommandDef: CommandDef = [
    ['google-disconnect <input>', 'gg-disconnect', 'gg-logout', 'ggd'],
    'Disconnect an account, proxy to `google disconnect`.',
  ];

  /**
   * @param <id> - The Google account id
   */
  googleActiveCommandDef: CommandDef = [
    ['google-active <id>', 'gg-active', 'gg-change', 'gga'],
    'Change the active account, proxy to `google active`.',
  ];

  constructor() {
    this.version = require('../../package.json').version;
    this.cliModule = new CliModule();
    this.unknownCommand = new UnknownCommand(this.cliModule.terminalService);
    this.docsCommand = new DocsCommand(this.cliModule.messageService);
    this.updateCommand = new UpdateCommand(this.cliModule.terminalService);
    this.helpCommand = new HelpCommand(this.cliModule.helpService);
    this.googleListCommand = new GoogleListCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.googleService
    );
    this.googleConnectCommand = new GoogleConnectCommand();
    this.googleDisconnectCommand = new GoogleDisconnectCommand();
    this.googleActiveCommand = new GoogleActiveCommand();
    this.googleCommand = new GoogleCommand(
      this.cliModule.helpService,
      this.cliModule.messageService,
      this.googleListCommand,
      this.googleConnectCommand,
      this.googleDisconnectCommand,
      this.googleActiveCommand
    );
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
        .command(command as string)
        .description(description)
        .action(() => this.docsCommand.run());
    })();

    // update
    (() => {
      const [
        [command, ...aliases],
        description,
        yesOpt,
        depsOpt,
      ] = this.updateCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...yesOpt)
        .option(...depsOpt)
        .action(options => this.updateCommand.run(this.version, options));
    })();

    // google
    (() => {
      const [
        [command, ...aliases],
        description,
        yesOpt,
        credsOpt,
        fullDriveOpt,
      ] = this.googleCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...yesOpt)
        .option(...credsOpt)
        .option(...fullDriveOpt)
        .action((subCommand, params, options) =>
          this.googleCommand.run(subCommand, params, options)
        );
    })();

    // google-list
    (() => {
      const [[command, ...aliases], description] = this.googleListCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.googleListCommand.run());
    })();

    // google-connect
    (() => {
      const [
        [command, ...aliases],
        description,
        yesOpt,
        credsOpt,
        fullDriveOpt,
      ] = this.googleConnectCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...yesOpt)
        .option(...credsOpt)
        .option(...fullDriveOpt)
        .action(options => this.googleConnectCommand.run(options));
    })();

    // google-disconnect
    (() => {
      const [
        [command, ...aliases],
        description,
      ] = this.googleDisconnectCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(input => this.googleDisconnectCommand.run(input));
    })();

    // google-active
    (() => {
      const [[command, ...aliases], description] = this.googleActiveCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(id => this.googleActiveCommand.run(id));
    })();

    // help
    (() => {
      const [
        [command, ...aliases],
        description,
        detailOpt,
      ] = this.helpCommandDef;
      commander
        .command(command)
        .aliases(aliases)
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
        .command(command as string)
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

type CommandDef = [string | string[], string, ...Array<[string, string]>];
