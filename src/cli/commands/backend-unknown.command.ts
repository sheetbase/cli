import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface BackendUnknownCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class BackendUnknownCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: BackendUnknownCommandOptions) {
    this.terminalService.run(
      'npm run ' + command,
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.BACKEND_DIR
    );
  }
}
