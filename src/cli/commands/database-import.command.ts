export interface DatabaseImportCommandOptions {
  id?: string;
}

export class DatabaseImportCommand {
  constructor() {}

  run(
    tableName: string,
    inputSource: string,
    commandOptions: DatabaseImportCommandOptions
  ) {
    const source = inputSource || tableName;
  }
}
