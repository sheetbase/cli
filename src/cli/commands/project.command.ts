interface ProjectCommandOptions {
  fresh?: boolean;
  open?: boolean;
}

export class ProjectCommand {
  constructor() {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: ProjectCommandOptions
  ) {
    console.log('TODO: ...');
  }
}
