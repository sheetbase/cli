import {red} from 'chalk';
import {prompt} from 'inquirer';

export interface GoogleConnectCommandOptions {
  yes?: boolean;
  creds?: boolean;
  fullDrive?: boolean;
}

export class GoogleConnectCommand {
  constructor() {}

  async run(commandOptions: GoogleConnectCommandOptions) {
    console.log('TODO: ...');
  }

  private askForGoogleOAuth2() {
    console.log(
      '\nThe CLI need you to grant the access to your Google account, ' +
        'so it can create assets and setup the project automatically.'
    );
    console.log('\nIt will:');
    console.log(
      '   + Create a folder in your Drive as the project root folder.'
    );
    // tslint:disable-next-line:max-line-length
    console.log(
      '   + May create a content folder, a Spreadsheet database file, an Apps Script backend file inside.'
    );
    console.log(
      '   + May read and modify to those files and folders, associated with the project.'
    );
    console.log('\nBeyond those, it ' + red('WILL NOT') + ':');
    console.log('   + Read or modify to anything else.\n');

    const questions = [
      {
        type: 'input',
        name: 'loginConfirm',
        message: 'Process now? [Y/N]:',
      },
    ];
    return prompt(questions);
  }
}
