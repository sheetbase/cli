import {MessageService} from '../../lib/services/message.service';
import {HelpService} from '../../lib/services/help.service';

import {ConfigListCommand} from './config-list.command';
import {ConfigUpdateCommand} from './config-update.command';
import {ConfigImportCommand} from './config-import.command';
import {ConfigExportCommand} from './config-export.command';

export class ConfigCommand {
  constructor(
    private messageService: MessageService,
    private helpService: HelpService,
    private configListCommand: ConfigListCommand,
    private configUpdateCommand: ConfigUpdateCommand,
    private configImportCommand: ConfigImportCommand,
    private configExportCommand: ConfigExportCommand
  ) {}

  run(subCommand: string, params: string[]) {
    switch (subCommand) {
      case 'list':
      case 'ls':
        this.configListCommand.run();
        break;
      case 'update':
      case 'set':
        this.configUpdateCommand.run(params);
        break;
      case 'import':
      case 'im':
        this.configImportCommand.run(params[0]);
        break;
      case 'export':
      case 'ex':
        this.configExportCommand.run();
        break;
      default:
        this.messageService.logInfo('APP__INFO__INVALID_SUBCOMMAND', false, [
          'config',
        ]);
        console.log(this.helpService.configHelp());
        break;
    }
  }
}
