interface DatabaseCommandOptions {
  id?: string;
  data?: boolean;
}

export class DatabaseCommand {
  constructor() {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: DatabaseCommandOptions
  ) {
    console.log('TODO: ...');
  }
}
