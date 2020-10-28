import {red} from 'chalk';
import {prompt} from 'inquirer';
import {writeJson} from 'fs-extra';

import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';

export interface GoogleConnectCommandOptions {
  yes?: boolean;
  creds?: boolean;
  fullDrive?: boolean;
}

export class GoogleConnectCommand {
  constructor(
    private messageService: MessageService,
    private googleService: GoogleService
  ) {}

  async run(commandOptions: GoogleConnectCommandOptions) {
    // ask for permission
    let loginConfirm = 'NO';
    if (!commandOptions.yes) {
      const answer = await this.askForGoogleOAuth2();
      loginConfirm = (answer.loginConfirm || '').toLowerCase();
    } else {
      loginConfirm = 'yes';
    }

    // answer = YES
    if (['y', 'yes'].includes(loginConfirm)) {
      // go for authorization
      await this.googleService.authorizeWithLocalhost(commandOptions.fullDrive);
      const account = await this.googleService.retrieveTemporaryAccount(
        commandOptions.fullDrive
      );
      // save RC
      if (commandOptions.creds) {
        await writeJson('.googlerc.json', account);
        this.messageService.logWarn('GOOGLE_CONNECT__WARN__CREDS', true);
      }
      // done
      this.messageService.logOk('GOOGLE_CONNECT__OK', true);
    }
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
