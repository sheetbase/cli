import {red, green} from 'chalk';
const ttyTable = require('tty-table');

import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';

export class GoogleListCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private googleService: GoogleService
  ) {}

  async run() {
    // load accounts, default id and rc account
    const googleAccounts = await this.googleService.getAllAccounts();
    const defaultGoogleAccountId = this.googleService.getDefaultAccountId();
    const rcAccount = await this.googleService.getLocalAccount();
    if (!googleAccounts && !rcAccount) {
      return this.messageService.logError('GOOGLE__ERROR__NO_ACCOUNT');
    }
    // print out layout
    const table = ttyTable(
      [
        {value: 'ID', width: 100},
        {value: 'Name', width: 100},
        {value: 'Email', width: 100},
        {value: 'Since', width: 100},
        {value: 'Mode', width: 50},
      ],
      []
    );
    const row = (
      id: string,
      name: string,
      email: string,
      at: unknown,
      fullDrive = false
    ) => {
      return [
        id,
        name || '?',
        email || '?',
        this.helperService.formatDate(new Date(at as number)),
        fullDrive ? red('FULL') : green('RESTRICTED'),
      ];
    };

    // print out data
    if (googleAccounts) {
      // all accounts
      for (const key of Object.keys(googleAccounts)) {
        const googleAccount = googleAccounts[key];
        let {id} = googleAccount.profile;
        const {name = '', email} = googleAccount.profile;
        const grantedAt: string = this.helperService.formatDate(
          googleAccount.grantedAt
            ? new Date(googleAccount.grantedAt)
            : new Date()
        );
        const {fullDrive} = googleAccount;
        if (id === defaultGoogleAccountId) {
          id = `${id} (default)`;
        }
        table.push(row(id, name, email, grantedAt, fullDrive));
      }
    }
    if (rcAccount) {
      const {id, name = '', email} = rcAccount.profile;
      const grantedAt: string = this.helperService.formatDate(
        rcAccount.grantedAt ? new Date(rcAccount.grantedAt) : new Date()
      );
      const {fullDrive} = rcAccount;
      table.push(row(`${id} (local)`, name, email, grantedAt, fullDrive));
    }
    console.log(table.render());

    // done
    this.messageService.logOk('GOOGLE_LIST__OK', true);
  }
}
