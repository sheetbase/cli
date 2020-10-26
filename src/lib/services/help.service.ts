import {green} from 'chalk';

export class HelpService {
  constructor() {}

  help() {
    return (
      '' +
      `
  Global commands:

    ${green('google [subcommand]')} ........ Manage Google accounts.
    ${green('project [subcommand]')} ....... Project general tasks.
    ${green('database [subcommand]')} ...... Manage the database.
    ${green('new [name] [source]')} ........ Start a new project.
    ${green('docs')} ....................... Open the documentation.
    ${green('update')} ..................... Check and install update.
    ${green('help')} ....................... Display help.
    ${green('<cmd>')} ...................... Run any command.

  Project related commands:

    ${green('new')} ........................ Start a new project.
    ${green('setup')} ...................... Setup the project.
    ${green('configs')} .................... View project configs.
    ${green('config [subcommand]')} ........ Config the project.
    ${green('urls')} ....................... View project URLs.
    ${green('url [name]')} ................. View or open a project URL.
    ${green('info')} ....................... Output project info.
    ${green('lint')} ....................... Lint the project.
    ${green('test')} ....................... Test the project.
    ${green('build')} ...................... Build the project.
    ${green('preview')} .................... Preview the project.
    ${green('deploy')} ..................... Deploy the project.
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
    ${green('<cmd>')} ...................... Run any command.

  Command groups:

    ${green('google [subcommand]')} ........ Manage Google accounts.
    ${green('project [subcommand]')} ....... Project general tasks.
    ${green('config [subcommand]')} ........ Config the project.
    ${green('backend [subcommand]')} ....... Backend related tasks.
    ${green('frontend [subcommand]')} ...... Frontend related tasks.
    ${green('database [subcommand]')} ...... Manage the database.

  Google sub-commands:
  ${this.googleHelp()}

  Project sub-commands:
  ${this.projectHelp()}

  Config sub-commands:
  ${this.configHelp()}

  Backend sub-commands:
  ${this.backendHelp()}

  Frontend sub-commands:
  ${this.frontendHelp()}

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
    ${green('setup')} ...................... Setup the project.
    ${green('configs')} .................... View project configs.
    ${green('urls')} ....................... View project URLs.
    ${green('url [name]')} ................. View or open a project URL.
    ${green('info')} ....................... Output project info.
    ${green('lint')} ....................... Lint the project.
    ${green('test')} ....................... Test the project.
    ${green('build')} ...................... Build the project.
    ${green('preview')} .................... Preview the project.
    ${green('deploy')} ..................... Deploy the project.`
    );
  }

  configHelp() {
    return (
      '' +
      `
    ${green('list')} ....................... List configurations.
    ${green('update')} ..................... Update configurations.
    ${green('import')} ..................... Import configurations.
    ${green('export')} ..................... Export configurations.`
    );
  }

  backendHelp() {
    return (
      '' +
      `
    ${green('lint')} ....................... Lint the backend.
    ${green('test')} ....................... Test the backend.
    ${green('build')} ...................... Build the backend.
    ${green('push')} ....................... Push the backend.
    ${green('deploy')} ..................... Deploy the backend.
    ${green('install')} .................... Install backend dependencies.
    ${green('uninstall')} .................. Uninstall backend dependencies.
    ${green('run')} ........................ Run backend scripts.
    ${green('<cmd>')} ...................... Run any backend command.`
    );
  }

  frontendHelp() {
    return (
      '' +
      `
      ${green('lint')} ....................... Lint the frontend.
      ${green('test')} ....................... Test the frontend.
      ${green('build')} ...................... Build the frontend.
      ${green('prerender')} .................. Prerender the frontend.
      ${green('deploy')} ..................... Deploy the frontend.
      ${green('install')} .................... Install frontend dependencies.
      ${green('uninstall')} .................. Uninstall frontend dependencies.
      ${green('run')} ........................ Run frontend scripts.
      ${green('<cmd>')} ...................... Run any frontend command.`
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
