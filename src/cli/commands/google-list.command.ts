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

  run() {
    console.log('TODO: ...');
  }
}
