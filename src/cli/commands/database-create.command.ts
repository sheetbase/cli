export interface DatabaseCreateCommandOptions {
  id?: string;
  data?: boolean;
}

export class DatabaseCreateCommand {
  constructor() {}

  run(inputs: string[], commandOptions: DatabaseCreateCommandOptions) {
    console.log('TODO: ...');
  }
}
