export interface DatabaseCreateCommandOptions {
  id?: string;
  data?: boolean;
}

export class DatabaseCreateCommand {
  constructor() {}

  run(input: string[], commandOptions: DatabaseCreateCommandOptions) {
    console.log('TODO: ...');
  }
}
