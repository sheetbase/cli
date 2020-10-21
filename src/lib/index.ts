import {HelperService} from './services/helper.service';
import {HelpService} from './services/help.service';
import {TerminalService} from './services/terminal.service';
import {MessageService} from './services/message.service';

export class Lib {
  helperService: HelperService;
  helpService: HelpService;
  terminalService: TerminalService;
  messageService: MessageService;

  constructor() {
    this.helperService = new HelperService();
    this.helpService = new HelpService();
    this.terminalService = new TerminalService();
    this.messageService = new MessageService();
  }
}
