import {green} from 'chalk';

export class HelpService {
  constructor() {}

  help() {
    return (
      '' +
      `
  Global commands:

    ${green('google [subcommand]')} ........ Manage Google accounts.
    ${green('database [subcommand]')} ...... Manage the database.
    ${green('start [name] [resource]')} .... Start a new project.
    ${green('docs')} ....................... Open the documentation.
    ${green('update')} ..................... Check and install update.
    ${green('help')} ....................... Display help.
    ${green('<cmd>')} ...................... Run unknown commands.

  Project commands:

    ${green('setup')} ...................... Setup the project.
    ${green('configs')} .................... View project configs.
    ${green('config [subcommand]')} ........ Config the project.
    ${green('urls')} ....................... View project URLs.
    ${green('url [name]')} ................. View or open a project URL.
    ${green('info')} ....................... Output project info.
    ${green('build')} ...................... Build the project.
    ${green('deploy')} ..................... Deploy the project.
    ${green('preview')} .................... Preview the project.
    ${green('backend [subcommand]')} ....... Run backend related commands.
    ${green('frontend [subcommand]')} ...... Run frontend related commands.`
    );
  }

  helpDetail() {
    return (
      '' +
      `
  General commands:

    ${green('docs')} ....................... Open the documentation.
    ${green('update')} ..................... Check and install update.
    ${green('help')} ....................... Display help.
    ${green('<cmd>')} ...................... Run unknown commands.

  Command groups:

    ${green('google [subcommand]')} ........ Manage Google accounts.
    ${green('project [subcommand]')} ....... Project general tasks.
    ${green('database [subcommand]')} ...... Manage the database.

  Google sub-commands:
  ${this.googleHelp()}

  Project sub-commands:
  ${this.projectHelp()}

  Database sub-commands:
  ${this.databaseHelp()}`
    );
  }

  googleHelp() {
    return (
      '' +
      `
    ${green('list')} ....................... List connected accounts.
    ${green('connect')} .................... Connect an account.
    ${green('disconnect [input]')} ......... Disconnect an account.
    ${green('active [id]')} ................ Change the active account.`
    );
  }

  projectHelp() {
    return (
      '' +
      `
    ${green('start [name] [resource]')} .... Start a new project.
    ${green('setup')} ...................... Setup the project.
    ${green('configs')} .................... View project configs.
    ${green('config [subcommand]')} ........ Config the project.
    ${green('urls')} ....................... View project URLs.
    ${green('url [name]')} ................. View or open a project URL.
    ${green('info')} ....................... Output project info.
    ${green('build')} ...................... Build the project.
    ${green('deploy')} ..................... Deploy the project.
    ${green('preview')} .................... Preview the project.
    ${green('backend [subcommand]')} ....... Run backend related commands.
    ${green('frontend [subcommand]')} ...... Run frontend related commands.`
    );
  }

  databaseHelp() {
    return (
      '' +
      `
    ${green('list')} ....................... List tables and models.
    ${green('create')} ..................... Create database tables.
    ${green('import')} ..................... Import data to a sheet.
    ${green('export')} ..................... Export data from a sheet.`
    );
  }
}
