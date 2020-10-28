import {green} from 'chalk';

import {MessageService} from '../../lib/services/message.service';
import {GoogleService, GoogleAccounts} from '../../lib/services/google.service';

export class GoogleDisconnectCommand {
  constructor(
    private messageService: MessageService,
    private googleService: GoogleService
  ) {}

  async run(input: 'all' | 'active' | 'local' | string) {
    // must have a valid input
    if (!input) {
      return this.messageService.logError(
        'GOOGLE_DISCONNECTED__ERROR__NO_VALUE'
      );
    }
    // remove accounts
    let disconnectedAccounts: GoogleAccounts = {};
    if (input === 'all') {
      disconnectedAccounts = await this.googleService.removeAllAccounts();
    } else if (input === 'default') {
      disconnectedAccounts = await this.googleService.removeDefaultAccount();
    } else if (input === 'local') {
      disconnectedAccounts = await this.googleService.removeLocalAccount();
    } else {
      disconnectedAccounts = await this.googleService.removeAccount(input);
    }
    // log result
    if (disconnectedAccounts) {
      console.log('\n Accounts disconnected:');
      for (const key of Object.keys(disconnectedAccounts || {})) {
        const {name, email} = disconnectedAccounts[key].profile;
        console.log(` + ${green(email)} ${name ? '(' + name + ')' : ''}`);
      }
      this.messageService.logOk('GOOGLE_DISCONNECTED__OK', true);
    } else {
      this.messageService.logInfo(
        'GOOGLE_DISCONNECTED__INFO__NO_ACCOUNTS',
        true
      );
    }
  }
}
