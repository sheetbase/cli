interface NewCommandOptions {
  skipInstall?: boolean;
  skipSetup?: boolean;
}

export class NewCommand {
  constructor() {}

  run(name: string, source: string, commandOptions: NewCommandOptions) {
    console.log('TODO: ...');
  }
}
