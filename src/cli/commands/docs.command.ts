const open = require('open');

import {MessageService} from '../../lib/services/message.service';

export class DocsCommand {
  constructor(private messageService: MessageService) {}

  run() {
    const docsUrl = 'https://sheetbase.dev/docs';
    this.messageService.logInfo('APP__INFO__LINK_OPENED', false, [docsUrl]);
    open(docsUrl);
  }
}
