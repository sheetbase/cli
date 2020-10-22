export interface GoogleConnectCommandOptions {
  yes?: boolean;
  creds?: boolean;
  fullDrive?: boolean;
}

export class GoogleConnectCommand {
  constructor() {}

  async run(commandOptions: GoogleConnectCommandOptions) {
    console.log('google connect ...');
    console.log('yes: ', commandOptions.yes);
    console.log('creds: ', commandOptions.creds);
    console.log('full drive: ', commandOptions.fullDrive);
  }
}
