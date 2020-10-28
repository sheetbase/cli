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
import {NewCommand} from './commands/new.command';
import {ProjectCommand} from './commands/project.command';
import {ProjectSetupCommand} from './commands/project-setup.command';
import {ProjectConfigsCommand} from './commands/project-configs.command';
import {ProjectUrlsCommand} from './commands/project-urls.command';
import {ProjectUrlCommand} from './commands/project-url.command';
import {ProjectInfoCommand} from './commands/project-info.command';
import {ProjectLintCommand} from './commands/project-lint.command';
import {ProjectTestCommand} from './commands/project-test.command';
import {ProjectBuildCommand} from './commands/project-build.command';
import {ProjectPreviewCommand} from './commands/project-preview.command';
import {ProjectDeployCommand} from './commands/project-deploy.command';
import {ConfigCommand} from './commands/config.command';
import {ConfigListCommand} from './commands/config-list.command';
import {ConfigUpdateCommand} from './commands/config-update.command';
import {ConfigImportCommand} from './commands/config-import.command';
import {ConfigExportCommand} from './commands/config-export.command';
import {BackendCommand} from './commands/backend.command';
import {BackendLintCommand} from './commands/backend-lint.command';
import {BackendTestCommand} from './commands/backend-test.command';
import {BackendBuildCommand} from './commands/backend-build.command';
import {BackendPushCommand} from './commands/backend-push.command';
import {BackendDeployCommand} from './commands/backend-deploy.command';
import {BackendInstallCommand} from './commands/backend-install.command';
import {BackendUninstallCommand} from './commands/backend-uninstall.command';
import {BackendRunCommand} from './commands/backend-run.command';
import {BackendUnknownCommand} from './commands/backend-unknown.command';
import {FrontendCommand} from './commands/frontend.command';
import {FrontendLintCommand} from './commands/frontend-lint.command';
import {FrontendTestCommand} from './commands/frontend-test.command';
import {FrontendBuildCommand} from './commands/frontend-build.command';
import {FrontendPrerenderCommand} from './commands/frontend-prerender.command';
import {FrontendDeployCommand} from './commands/frontend-deploy.command';
import {FrontendInstallCommand} from './commands/frontend-install.command';
import {FrontendUninstallCommand} from './commands/frontend-uninstall.command';
import {FrontendRunCommand} from './commands/frontend-run.command';
import {FrontendUnknownCommand} from './commands/frontend-unknown.command';
import {DatabaseCommand} from './commands/database.command';
import {DatabaseListCommand} from './commands/database-list.command';
import {DatabaseCreateCommand} from './commands/database-create.command';
import {DatabaseImportCommand} from './commands/database-import.command';
import {DatabaseExportCommand} from './commands/database-export.command';

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
  newCommand: NewCommand;
  projectCommand: ProjectCommand;
  projectSetupCommand: ProjectSetupCommand;
  projectConfigsCommand: ProjectConfigsCommand;
  projectUrlsCommand: ProjectUrlsCommand;
  projectUrlCommand: ProjectUrlCommand;
  projectInfoCommand: ProjectInfoCommand;
  projectLintCommand: ProjectLintCommand;
  projectTestCommand: ProjectTestCommand;
  projectBuildCommand: ProjectBuildCommand;
  projectPreviewCommand: ProjectPreviewCommand;
  projectDeployCommand: ProjectDeployCommand;
  configCommand: ConfigCommand;
  configListCommand: ConfigListCommand;
  configUpdateCommand: ConfigUpdateCommand;
  configImportCommand: ConfigImportCommand;
  configExportCommand: ConfigExportCommand;
  backendCommand: BackendCommand;
  backendLintCommand: BackendLintCommand;
  backendTestCommand: BackendTestCommand;
  backendBuildCommand: BackendBuildCommand;
  backendPushCommand: BackendPushCommand;
  backendDeployCommand: BackendDeployCommand;
  backendInstallCommand: BackendInstallCommand;
  backendUninstallCommand: BackendUninstallCommand;
  backendRunCommand: BackendRunCommand;
  backendUnknownCommand: BackendUnknownCommand;
  frontendCommand: FrontendCommand;
  frontendLintCommand: FrontendLintCommand;
  frontendTestCommand: FrontendTestCommand;
  frontendBuildCommand: FrontendBuildCommand;
  frontendPrerenderCommand: FrontendPrerenderCommand;
  frontendDeployCommand: FrontendDeployCommand;
  frontendInstallCommand: FrontendInstallCommand;
  frontendUninstallCommand: FrontendUninstallCommand;
  frontendRunCommand: FrontendRunCommand;
  frontendUnknownCommand: FrontendUnknownCommand;
  databaseCommand: DatabaseCommand;
  databaseListCommand: DatabaseListCommand;
  databaseCreateCommand: DatabaseCreateCommand;
  databaseImportCommand: DatabaseImportCommand;
  databaseExportCommand: DatabaseExportCommand;

  commander = ['sheetbase', 'Official CLI for working with Sheetbase.'];

  unknownCommandDef: CommandDef = [
    '*',
    'Any other command will run: `npm run <cmd>`.',
  ];

  docsCommandDef: CommandDef = [['docs', 'd'], 'Open documentation.'];

  updateCommandDef: CommandDef = [
    ['update', 'u'],
    'Update the CLI to the latest version.',
    ['-y, --yes', 'Do update now.'],
    ['-s, --self', 'Update the CLI itself.'],
  ];

  helpCommandDef: CommandDef = [
    ['help', 'h'],
    'Display help.',
    ['-d, --detail', 'Show detail help.'],
  ];

  googleCommandDef: CommandDef = [
    ['google [subCommand] [params...]', 'gg'],
    'Manage Google accounts.',
    ['-y, --yes', '(connect) Agree on account connection.'],
    ['-c, --creds', '(connect) Save credential to .googlerc.json.'],
    ['-f, --full-drive', '(connect) Not recommended, full access to Drive.'],
  ];

  googleListCommandDef: CommandDef = [
    'google-list',
    'List connected accounts.',
  ];

  googleConnectCommandDef: CommandDef = [
    'google-connect',
    'Connect an account.',
    ['-y, --yes', 'Agree on account connection.'],
    ['-c, --creds', 'Save credential to .googlerc.json.'],
    ['-f, --full-drive', 'Not recommended, full access to Drive.'],
  ];

  /**
   * @param input - Disconnection input: {id}, all, active, local.
   */
  googleDisconnectCommandDef: CommandDef = [
    'google-disconnect <input>',
    'Disconnect connected accounts.',
  ];

  /**
   * @param id - The Google account id.
   */
  googleActiveCommandDef: CommandDef = [
    'google-active <id>',
    'Change the active account.',
  ];

  /**
   * @param name - The project name.
   * @param source? - The custom source.
   */
  newCommandDef: CommandDef = [
    ['new <name> [source]', 'start', 'n'],
    'Star a new project.',
    ['-i, --skip-install', 'Skip installing npm packages.'],
    ['-s, --skip-setup', 'Skip project setup.'],
  ];

  projectCommandDef: CommandDef = [
    ['project [subCommand] [params...]', 'p'],
    'Project related tasks.',
    ['-r, --fresh', '(setup) Force re-setup.'],
    ['-o, --open', '(url) Open the url in browser.'],
    ['-m, --message [value]', '(deploy) Deployment message.'],
  ];

  projectSetupCommandDef: CommandDef = [
    ['project-setup', 'setup'],
    'Setup the project.',
    ['-r, --fresh', 'Force re-setup.'],
  ];

  projectConfigsCommandDef: CommandDef = [
    ['project-configs', 'configs'],
    'View project configs.',
  ];

  projectUrlsCommandDef: CommandDef = [
    ['project-urls', 'urls'],
    'View project URLs.',
  ];

  /**
   * @param name - The url name.
   */
  projectUrlCommandDef: CommandDef = [
    ['project-url <name>', 'url'],
    'View or open a project URL.',
    ['-o, --open', 'Open the url in browser.'],
  ];

  projectInfoCommandDef: CommandDef = [
    ['project-info', 'info'],
    'Output project info.',
  ];

  projectLintCommandDef: CommandDef = [
    ['project-lint', 'lint'],
    'Lint the project.',
  ];

  projectTestCommandDef: CommandDef = [
    ['project-test', 'test'],
    'Test the project.',
  ];

  projectBuildCommandDef: CommandDef = [
    ['project-build', 'build'],
    'Build the project.',
  ];

  projectPreviewCommandDef: CommandDef = [
    ['project-preview', 'preview'],
    'Preview the project.',
  ];

  projectDeployCommandDef: CommandDef = [
    ['project-deploy', 'deploy'],
    'Deploy the project.',
    ['-m, --message [value]', 'Deployment message.'],
  ];

  configCommandDef: CommandDef = [
    ['config [subCommand] [params...]', 'c'],
    'Config the project.',
  ];

  configListCommandDef: CommandDef = ['config-list', 'List configurations.'];

  /**
   * @param input...? - List of input.
   */
  configUpdateCommandDef: CommandDef = [
    'config-update [input...]',
    'Update configurations.',
  ];

  /**
   * @param path - Path to .json file.
   */
  configImportCommandDef: CommandDef = [
    'config-import <path>',
    'Import configurations.',
  ];

  configExportCommandDef: CommandDef = [
    'config-export',
    'Export configurations.',
  ];

  backendCommandDef: CommandDef = [
    ['backend [subCommand] [params...]', 'b'],
    'Backend related tasks.',
    ['-m, --message [value]', '(deploy) Deployment message.'],
  ];

  backendLintCommandDef: CommandDef = ['backend-lint', 'Lint the backend.'];

  backendTestCommandDef: CommandDef = ['backend-test', 'Test the backend.'];

  backendBuildCommandDef: CommandDef = ['backend-build', 'Build the backend.'];

  backendPushCommandDef: CommandDef = ['backend-push', 'Push the backend.'];

  backendDeployCommandDef: CommandDef = [
    'backend-deploy',
    'Deploy the backend.',
    ['-m, --message [value]', 'Deployment message.'],
  ];

  backendInstallCommandDef: CommandDef = [
    'backend-install',
    'Install backend dependencies.',
  ];

  backendUninstallCommandDef: CommandDef = [
    'backend-uninstall',
    'Uninstall backend dependencies.',
  ];

  backendRunCommandDef: CommandDef = ['backend-run', 'Run backend scripts.'];

  frontendCommandDef: CommandDef = [
    ['frontend [subCommand] [params...]', 'f'],
    'Frontend related tasks.',
    ['-m, --message [value]', '(deploy) Deployment message.'],
    ['-o, --only [value]', '(prerender) Prerender only certain parts.'],
    ['-f, --force [value]', '(prerender) Force prerender all or parts.'],
  ];

  frontendLintCommandDef: CommandDef = ['frontend-lint', 'Lint the frontend.'];

  frontendTestCommandDef: CommandDef = ['frontend-test', 'Test the frontend.'];

  frontendBuildCommandDef: CommandDef = [
    'frontend-build',
    'Build the frontend.',
  ];

  frontendPrerenderCommandDef: CommandDef = [
    'frontend-prerender',
    'Prerender the frontend.',
    ['-o, --only [value]', 'Prerender only certain parts.'],
    ['-f, --force [value]', 'Force prerender all or certain parts.'],
  ];

  frontendDeployCommandDef: CommandDef = [
    'frontend-deploy',
    'Deploy the frontend.',
    ['-m, --message [value]', 'Deployment message.'],
  ];

  frontendInstallCommandDef: CommandDef = [
    'frontend-install',
    'Install frontend dependencies.',
  ];

  frontendUninstallCommandDef: CommandDef = [
    'frontend-uninstall',
    'Uninstall frontend dependencies.',
  ];

  frontendRunCommandDef: CommandDef = ['frontend-run', 'Run frontend scripts.'];

  databaseCommandDef: CommandDef = [
    ['database [subCommand] [params...]', 'db'],
    'Manage the database.',
    ['-i, --id [value]', 'Custom database id.'],
    ['-r, --remote', '(list) List remote tables.'],
    ['-d, --data', '(create) Create table with sample data.'],
  ];

  databaseListCommandDef: CommandDef = [
    'database-list',
    'List local or remote models.',
    ['-i, --id [value]', 'Custom database id.'],
    ['-r, --remote', 'List remote tables.'],
  ];

  /**
   * @param input...? - List of table names, ex.: categories posts ...
   */
  databaseCreateCommandDef: CommandDef = [
    'database-create [input...]',
    'Create tables in the database.',
    ['-i, --id [value]', 'Custom database id.'],
    ['-d, --data', 'Create table with sample data.'],
  ];

  /**
   * @param table - The table name.
   * @param source? - Source to the data or default.
   */
  databaseImportCommandDef: CommandDef = [
    'database-import <table> [source]',
    'Import data to the database.',
    ['-i, --id [value]', 'Custom database id.'],
  ];

  /**
   * @param table - The table name.
   * @param dir? - Custom export folder.
   */
  databaseExportCommandDef: CommandDef = [
    'database-export <table> [dir]',
    'Export data from the database.',
    ['-i, --id [value]', 'Custom database id.'],
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
    this.googleConnectCommand = new GoogleConnectCommand(
      this.cliModule.messageService,
      this.cliModule.googleService
    );
    this.googleDisconnectCommand = new GoogleDisconnectCommand(
      this.cliModule.messageService,
      this.cliModule.googleService
    );
    this.googleActiveCommand = new GoogleActiveCommand(
      this.cliModule.messageService,
      this.cliModule.googleService
    );
    this.googleCommand = new GoogleCommand(
      this.cliModule.helpService,
      this.cliModule.messageService,
      this.googleListCommand,
      this.googleConnectCommand,
      this.googleDisconnectCommand,
      this.googleActiveCommand
    );
    this.newCommand = new NewCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.fileService,
      this.cliModule.fetchService,
      this.cliModule.terminalService
    );
    this.configListCommand = new ConfigListCommand(
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.configUpdateCommand = new ConfigUpdateCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.configImportCommand = new ConfigImportCommand(
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.configExportCommand = new ConfigExportCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.configCommand = new ConfigCommand(
      this.cliModule.messageService,
      this.cliModule.helpService,
      this.configListCommand,
      this.configUpdateCommand,
      this.configImportCommand,
      this.configExportCommand
    );
    this.backendLintCommand = new BackendLintCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendTestCommand = new BackendTestCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendBuildCommand = new BackendBuildCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendPushCommand = new BackendPushCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.googleService,
      this.cliModule.gasService
    );
    this.backendDeployCommand = new BackendDeployCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.googleService,
      this.cliModule.gasService
    );
    this.backendInstallCommand = new BackendInstallCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendUninstallCommand = new BackendUninstallCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendRunCommand = new BackendRunCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendUnknownCommand = new BackendUnknownCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.backendCommand = new BackendCommand(
      this.backendLintCommand,
      this.backendTestCommand,
      this.backendBuildCommand,
      this.backendPushCommand,
      this.backendDeployCommand,
      this.backendInstallCommand,
      this.backendUninstallCommand,
      this.backendRunCommand,
      this.backendUnknownCommand
    );
    this.frontendLintCommand = new FrontendLintCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendTestCommand = new FrontendTestCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendBuildCommand = new FrontendBuildCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.terminalService,
      this.cliModule.buildService
    );
    this.frontendPrerenderCommand = new FrontendPrerenderCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.fileService,
      this.cliModule.googleService,
      this.cliModule.buildService
    );
    this.frontendDeployCommand = new FrontendDeployCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendInstallCommand = new FrontendInstallCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendUninstallCommand = new FrontendUninstallCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendRunCommand = new FrontendRunCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendUnknownCommand = new FrontendUnknownCommand(
      this.cliModule.projectService,
      this.cliModule.terminalService
    );
    this.frontendCommand = new FrontendCommand(
      this.frontendLintCommand,
      this.frontendTestCommand,
      this.frontendBuildCommand,
      this.frontendPrerenderCommand,
      this.frontendDeployCommand,
      this.frontendInstallCommand,
      this.frontendUninstallCommand,
      this.frontendRunCommand,
      this.frontendUnknownCommand
    );
    this.projectSetupCommand = new ProjectSetupCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.googleService,
      this.cliModule.driveService,
      this.cliModule.gasService
    );
    this.projectConfigsCommand = new ProjectConfigsCommand(
      this.configListCommand
    );
    this.projectUrlsCommand = new ProjectUrlsCommand(
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.projectUrlCommand = new ProjectUrlCommand(
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.projectInfoCommand = new ProjectInfoCommand(
      this.cliModule.projectService
    );
    this.projectLintCommand = new ProjectLintCommand(
      this.backendLintCommand,
      this.frontendLintCommand
    );
    this.projectTestCommand = new ProjectTestCommand(
      this.backendTestCommand,
      this.frontendTestCommand
    );
    this.projectBuildCommand = new ProjectBuildCommand(
      this.cliModule.messageService,
      this.backendBuildCommand,
      this.frontendBuildCommand,
      this.frontendPrerenderCommand
    );
    this.projectPreviewCommand = new ProjectPreviewCommand(
      this.cliModule.messageService,
      this.cliModule.projectService
    );
    this.projectDeployCommand = new ProjectDeployCommand(
      this.cliModule.messageService,
      this.backendDeployCommand,
      this.frontendDeployCommand
    );
    this.projectCommand = new ProjectCommand(
      this.cliModule.messageService,
      this.cliModule.helpService,
      this.projectSetupCommand,
      this.projectConfigsCommand,
      this.projectUrlsCommand,
      this.projectUrlCommand,
      this.projectInfoCommand,
      this.projectLintCommand,
      this.projectTestCommand,
      this.projectBuildCommand,
      this.projectPreviewCommand,
      this.projectDeployCommand
    );
    this.databaseListCommand = new DatabaseListCommand(
      this.cliModule.messageService,
      this.cliModule.projectService,
      this.cliModule.modelService
    );
    this.databaseCreateCommand = new DatabaseCreateCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.googleService,
      this.cliModule.spreadsheetService,
      this.cliModule.projectService,
      this.cliModule.modelService,
      this.cliModule.fetchService
    );
    this.databaseImportCommand = new DatabaseImportCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.googleService,
      this.cliModule.spreadsheetService,
      this.cliModule.projectService,
      this.cliModule.modelService,
      this.cliModule.fetchService
    );
    this.databaseExportCommand = new DatabaseExportCommand(
      this.cliModule.helperService,
      this.cliModule.messageService,
      this.cliModule.googleService,
      this.cliModule.spreadsheetService,
      this.cliModule.projectService
    );
    this.databaseCommand = new DatabaseCommand(
      this.cliModule.messageService,
      this.cliModule.helpService,
      this.databaseListCommand,
      this.databaseCreateCommand,
      this.databaseImportCommand,
      this.databaseExportCommand
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
      const [[command, ...aliases], description] = this.docsCommandDef;
      commander
        .command(command)
        .aliases(aliases)
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
      const [command, description] = this.googleListCommandDef;
      commander
        .command(command as string)
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
        .command(command as string)
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
        .command(command as string)
        .description(description)
        .action(input => this.googleDisconnectCommand.run(input));
    })();

    // google-active
    (() => {
      const [command, description] = this.googleActiveCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(id => this.googleActiveCommand.run(id));
    })();

    // new
    (() => {
      const [
        [command, ...aliases],
        description,
        skipInstallOpt,
        skipSetupOpt,
      ] = this.newCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...skipInstallOpt)
        .option(...skipSetupOpt)
        .action((name, source, options) =>
          this.newCommand.run(name, source, options)
        );
    })();

    // project
    (() => {
      const [
        [command, ...aliases],
        description,
        freshOpt,
        openOpt,
        messageOpt,
      ] = this.projectCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...freshOpt)
        .option(...openOpt)
        .option(...messageOpt)
        .action((subCommand, params, options) =>
          this.projectCommand.run(subCommand, params, options)
        );
    })();

    // project-setup
    (() => {
      const [[command, ...aliases], description] = this.projectSetupCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(options => this.projectSetupCommand.run(options));
    })();

    // project-configs
    (() => {
      const [
        [command, ...aliases],
        description,
      ] = this.projectConfigsCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectConfigsCommand.run());
    })();

    // project-urls
    (() => {
      const [[command, ...aliases], description] = this.projectUrlsCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectUrlsCommand.run());
    })();

    // project-url
    (() => {
      const [[command, ...aliases], description] = this.projectUrlCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((name, options) => this.projectUrlCommand.run(name, options));
    })();

    // project-info
    (() => {
      const [[command, ...aliases], description] = this.projectInfoCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectInfoCommand.run());
    })();

    // project-lint
    (() => {
      const [[command, ...aliases], description] = this.projectLintCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectLintCommand.run());
    })();

    // project-test
    (() => {
      const [[command, ...aliases], description] = this.projectTestCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectTestCommand.run());
    })();

    // project-build
    (() => {
      const [[command, ...aliases], description] = this.projectBuildCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectBuildCommand.run());
    })();

    // project-preview
    (() => {
      const [
        [command, ...aliases],
        description,
      ] = this.projectPreviewCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action(() => this.projectPreviewCommand.run());
    })();

    // project-deploy
    (() => {
      const [
        [command, ...aliases],
        description,
        messageOpt,
      ] = this.projectDeployCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...messageOpt)
        .action(options => this.projectDeployCommand.run(options));
    })();

    // config
    (() => {
      const [[command, ...aliases], description] = this.configCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((subCommand, params) =>
          this.configCommand.run(subCommand, params)
        );
    })();

    // config-list
    (() => {
      const [command, description] = this.configListCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.configListCommand.run());
    })();

    // config-update
    (() => {
      const [command, description] = this.configUpdateCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(input => this.configUpdateCommand.run(input));
    })();

    // config-import
    (() => {
      const [command, description] = this.configImportCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(path => this.configImportCommand.run(path));
    })();

    // config-export
    (() => {
      const [command, description] = this.configExportCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.configExportCommand.run());
    })();

    // backend
    (() => {
      const [[command, ...aliases], description] = this.backendCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .action((subCommand, params, options) =>
          this.backendCommand.run(subCommand, params, options)
        );
    })();

    // backend-lint
    (() => {
      const [command, description] = this.backendLintCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.backendLintCommand.run());
    })();

    // backend-test
    (() => {
      const [command, description] = this.backendTestCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.backendTestCommand.run());
    })();

    // backend-build
    (() => {
      const [command, description] = this.backendBuildCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.backendBuildCommand.run());
    })();

    // backend-push
    (() => {
      const [command, description] = this.backendPushCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.backendPushCommand.run());
    })();

    // backend-deploy
    (() => {
      const [command, description, messageOpt] = this.backendDeployCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...messageOpt)
        .action(options => this.backendDeployCommand.run(options));
    })();

    // backend-install
    (() => {
      const [command, description] = this.backendInstallCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.backendInstallCommand.run(command as string, options)
        );
    })();

    // backend-uninstall
    (() => {
      const [command, description] = this.backendUninstallCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.backendUninstallCommand.run(command as string, options)
        );
    })();

    // backend-run
    (() => {
      const [command, description] = this.backendRunCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.backendRunCommand.run(command as string, options)
        );
    })();

    // frontend
    (() => {
      const [
        [command, ...aliases],
        description,
        messageOpt,
        onlyOpt,
        forceOpt,
      ] = this.frontendCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...messageOpt)
        .option(...onlyOpt)
        .option(...forceOpt)
        .action((subCommand, params, options) =>
          this.frontendCommand.run(subCommand, params, options)
        );
    })();

    // frontend-lint
    (() => {
      const [command, description] = this.frontendLintCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.frontendLintCommand.run());
    })();

    // frontend-test
    (() => {
      const [command, description] = this.frontendTestCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.frontendTestCommand.run());
    })();

    // frontend-build
    (() => {
      const [command, description] = this.frontendBuildCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(() => this.frontendBuildCommand.run());
    })();

    // frontend-prerender
    (() => {
      const [
        command,
        description,
        onlyOpt,
        forceOpt,
      ] = this.frontendPrerenderCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...onlyOpt)
        .option(...forceOpt)
        .action(options => this.frontendPrerenderCommand.run(options));
    })();

    // frontend-deploy
    (() => {
      const [command, description, messageOpt] = this.frontendDeployCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...messageOpt)
        .action(options => this.frontendDeployCommand.run(options));
    })();

    // frontend-install
    (() => {
      const [command, description] = this.frontendInstallCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.frontendInstallCommand.run(command as string, options)
        );
    })();

    // frontend-uninstall
    (() => {
      const [command, description] = this.frontendUninstallCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.frontendUninstallCommand.run(command as string, options)
        );
    })();

    // frontend-run
    (() => {
      const [command, description] = this.frontendRunCommandDef;
      commander
        .command(command as string)
        .description(description)
        .action(options =>
          this.frontendRunCommand.run(command as string, options)
        );
    })();

    // database
    (() => {
      const [
        [command, ...aliases],
        description,
        idOpt,
        dataOpt,
        remoteOpt,
      ] = this.databaseCommandDef;
      commander
        .command(command)
        .aliases(aliases)
        .description(description)
        .option(...idOpt)
        .option(...dataOpt)
        .option(...remoteOpt)
        .action((subCommand, params, options) =>
          this.databaseCommand.run(subCommand, params, options)
        );
    })();

    // database-list
    (() => {
      const [
        command,
        description,
        idOpt,
        remoteOpt,
      ] = this.databaseListCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...idOpt)
        .option(...remoteOpt)
        .action(options => this.databaseListCommand.run(options));
    })();

    // database-create
    (() => {
      const [
        command,
        description,
        idOpt,
        dataOpt,
      ] = this.databaseCreateCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...idOpt)
        .option(...dataOpt)
        .action((input, options) =>
          this.databaseCreateCommand.run(input, options)
        );
    })();

    // database-import
    (() => {
      const [command, description, idOpt] = this.databaseImportCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...idOpt)
        .action((table, source, options) =>
          this.databaseImportCommand.run(table, source, options)
        );
    })();

    // database-export
    (() => {
      const [command, description, idOpt] = this.databaseExportCommandDef;
      commander
        .command(command as string)
        .description(description)
        .option(...idOpt)
        .action((table, dir, options) =>
          this.databaseExportCommand.run(table, dir, options)
        );
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
