import {MessageService} from '../../lib/services/message.service';
import {HelpService} from '../../lib/services/help.service';

import {
  DatabaseListCommand,
  DatabaseListCommandOptions,
} from './database-list.command';
import {
  DatabaseCreateCommand,
  DatabaseCreateCommandOptions,
} from './database-create.command';
import {
  DatabaseImportCommand,
  DatabaseImportCommandOptions,
} from './database-import.command';
import {
  DatabaseExportCommand,
  DatabaseExportCommandOptions,
} from './database-export.command';

interface DatabaseCommandOptions
  extends DatabaseListCommandOptions,
    DatabaseCreateCommandOptions,
    DatabaseImportCommandOptions,
    DatabaseExportCommandOptions {}

export class DatabaseCommand {
  constructor(
    private messageService: MessageService,
    private helpService: HelpService,
    private databaseListCommand: DatabaseListCommand,
    private databaseCreateCommand: DatabaseCreateCommand,
    private databaseImportCommand: DatabaseImportCommand,
    private databaseExportCommand: DatabaseExportCommand
  ) {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: DatabaseCommandOptions
  ) {
    switch (subCommand) {
      case 'list':
      case 'show':
      case 'ls':
        this.databaseListCommand.run(commandOptions);
        break;
      case 'create':
      case 'new':
        this.databaseCreateCommand.run(params, commandOptions);
        break;
      case 'import':
      case 'upload':
      case 'im':
        this.databaseImportCommand.run(params[0], params[1], commandOptions);
        break;
      case 'export':
      case 'download':
      case 'ex':
        this.databaseExportCommand.run(params[0], params[1], commandOptions);
        break;
      default:
        this.messageService.logInfo('APP__INFO__INVALID_SUBCOMMAND', false, [
          'database',
        ]);
        console.log(this.helpService.databaseHelp());
        break;
    }
  }
}
