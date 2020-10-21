export interface GoogleConnectOptions {
  yes?: boolean;
  creds?: boolean;
  fullDrive?: boolean;
}

export class GoogleConnectCommand {
  constructor() {}

  async run(cmdOptions: GoogleConnectOptions) {
    console.log('google connect ...');
    console.log('yes: ', cmdOptions.yes);
    console.log('creds: ', cmdOptions.creds);
    console.log('full drive: ', cmdOptions.fullDrive);
  }
}
