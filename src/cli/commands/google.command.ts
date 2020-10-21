import {HelpService} from '../../lib/services/help.service';
import {MessageService} from '../../lib/services/message.service';

import {GoogleListCommand} from './google-list.command';
import {
  GoogleConnectCommand,
  GoogleConnectOptions,
} from './google-connect.command';
import {GoogleDisconnectCommand} from './google-disconnect.command';
import {GoogleActiveCommand} from './google-active.command';

type GoogleOptions = GoogleConnectOptions;

export class GoogleCommand {
  constructor(
    private helpService: HelpService,
    private messageService: MessageService,
    private googleListCommand: GoogleListCommand,
    private googleConnectCommand: GoogleConnectCommand,
    private googleDisconnectCommand: GoogleDisconnectCommand,
    private googleActiveCommand: GoogleActiveCommand
  ) {}

  run(subCommand: string, params: string[], cmdOptions: GoogleOptions) {
    switch (subCommand) {
      case 'list':
      case 'ls':
        this.googleListCommand.run();
        break;
      case 'connect':
      case 'login':
      case 'add':
        this.googleConnectCommand.run(cmdOptions);
        break;
      case 'disconnect':
      case 'logout':
      case 'remove':
      case 'rm':
        this.googleDisconnectCommand.run(params[0]);
        break;
      case 'active':
        this.googleActiveCommand.run(params[0]);
        break;
      default:
        this.messageService.logInfo('APP__INFO__INVALID_SUBCOMMAND', false, [
          'google',
        ]);
        console.log(this.helpService.googleHelp());
        break;
    }
  }
}
