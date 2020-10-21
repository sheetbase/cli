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
    'update',
    'Update the CLI to the latest version.',
    ['-y, --yes', 'Do update now.'],
  ];

  helpCommandDef: CommandDef = [
    'help',
    'Display help.',
    ['-d, --detail', 'Show detail help.'],
  ];

  googleCommandDef: CommandDef = [
    'google [subCommand] [params...]',
    'Manage Google accounts.',
    ['-y, --yes', '(connect) Agree on account connection.'],
    ['-c, --creds', '(connect) Save credential to .googlerc.json.'],
    ['-f, --full-drive', '(connect) Not recommended, full access to Drive.'],
  ];

  googleListCommandDef: CommandDef = [
    'google-list',
    'List connected accounts, proxy to `google list`.',
  ];

  googleConnectCommandDef: CommandDef = [
    'google-connect',
    'Connect an account, proxy to `google connect`.',
    ['-y, --yes', 'Agree on account connection.'],
    ['-c, --creds', 'Save credential to .googlerc.json.'],
    ['-f, --full-drive', 'Not recommended, full access to Drive.'],
  ];

  googleDisconnectCommandDef: CommandDef = [
    'google-disconnect <input>',
    'Disconnect an account, proxy to `google disconnect`.',
  ];

  googleActiveCommandDef: CommandDef = [
    'google-active <id>',
    'Change the active account, proxy to `google active`.',
  ];

  constructor() {
    this.version = require('../../package.json').version;
    this.cliModule = new CliModule();
    this.unknownCommand = new UnknownCommand(this.cliModule.terminalService);
    this.docsCommand = new DocsCommand(this.cliModule.messageService);
    this.updateCommand = new UpdateCommand(this.cliModule.terminalService);
    this.helpCommand = new HelpCommand(this.cliModule.helpService);
    this.googleListCommand = new GoogleListCommand();
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

    // google
    (() => {
      const [
        command,
        description,
        yesOpt,
        credsOpt,
        fullDriveOpt,
      ] = this.googleCommandDef;
      commander
        .command(command)
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
      const [command, description] = this.googleListCommandDef;
      commander
        .command(command)
        .description(description)
        .action(() => this.googleListCommand.run());
    })();

    // google-connect
    (() => {
      const [
        command,
        description,
        yesOpt,
        credsOpt,
        fullDriveOpt,
      ] = this.googleConnectCommandDef;
      commander
        .command(command)
        .description(description)
        .option(...yesOpt)
        .option(...credsOpt)
        .option(...fullDriveOpt)
        .action(options => this.googleConnectCommand.run(options));
    })();

    // google-disconnect
    (() => {
      const [command, description] = this.googleDisconnectCommandDef;
      commander
        .command(command)
        .description(description)
        .action(input => this.googleDisconnectCommand.run(input));
    })();

    // google-active
    (() => {
      const [command, description] = this.googleActiveCommandDef;
      commander
        .command(command)
        .description(description)
        .action(id => this.googleActiveCommand.run(id));
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
