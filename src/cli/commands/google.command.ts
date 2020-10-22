import {HelpService} from '../../lib/services/help.service';
import {MessageService} from '../../lib/services/message.service';

import {GoogleListCommand} from './google-list.command';
import {
  GoogleConnectCommand,
  GoogleConnectCommandOptions,
} from './google-connect.command';
import {GoogleDisconnectCommand} from './google-disconnect.command';
import {GoogleActiveCommand} from './google-active.command';

type GoogleCommandOptions = GoogleConnectCommandOptions;

export class GoogleCommand {
  constructor(
    private helpService: HelpService,
    private messageService: MessageService,
    private googleListCommand: GoogleListCommand,
    private googleConnectCommand: GoogleConnectCommand,
    private googleDisconnectCommand: GoogleDisconnectCommand,
    private googleActiveCommand: GoogleActiveCommand
  ) {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: GoogleCommandOptions
  ) {
    switch (subCommand) {
      case 'list':
      case 'show':
      case 'ls':
        this.googleListCommand.run();
        break;
      case 'connect':
      case 'login':
      case 'cn':
        this.googleConnectCommand.run(commandOptions);
        break;
      case 'disconnect':
      case 'logout':
      case 'dc':
        this.googleDisconnectCommand.run(params[0]);
        break;
      case 'active':
      case 'change':
      case 'at':
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
