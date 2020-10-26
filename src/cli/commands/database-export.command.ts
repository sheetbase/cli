export interface DatabaseExportCommandOptions {
  id?: string;
}

export class DatabaseExportCommand {
  constructor() {}

  run(
    tableName: string,
    customDir: string,
    commandOptions: DatabaseExportCommandOptions
  ) {
    console.log('TODO: ...');
  }
}
